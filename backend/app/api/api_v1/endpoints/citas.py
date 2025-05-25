from typing import Any, List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.cita import Cita, CitaCreate, CitaUpdate, CitaWithRelations
from app.models.cita import Cita as CitaModel, EstadoCita
from app.models.usuario import Usuario as UsuarioModel
from app.models.vehiculo import Vehiculo as VehiculoModel
from app.models.servicio import Servicio as ServicioModel
from app.core.email import email_service

router = APIRouter()

@router.get("/", response_model=List[CitaWithRelations])
def get_citas(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener lista de citas.
    - Administradores y técnicos pueden ver todas las citas
    - Clientes solo pueden ver sus propias citas
    """
    if current_user.rol in ["admin", "tecnico"]:
        return db.query(CitaModel).offset(skip).limit(limit).all()
    return db.query(CitaModel).filter(CitaModel.usuario_id == current_user.id).all()

@router.post("/", response_model=Cita)
async def create_cita(
    *,
    db: Session = Depends(deps.get_db),
    cita_in: CitaCreate,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
    background_tasks: BackgroundTasks
) -> Any:
    """
    Crear nueva cita.
    - Administradores pueden crear citas para cualquier usuario
    - Clientes solo pueden crear citas para sí mismos
    """
    # Verificar permisos
    if current_user.rol != "admin" and cita_in.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No puede crear citas para otros usuarios"
        )
    
    # Verificar que el vehículo pertenece al usuario
    vehiculo = db.query(VehiculoModel).filter(VehiculoModel.id == cita_in.vehiculo_id).first()
    if not vehiculo:
        raise HTTPException(
            status_code=404,
            detail="Vehículo no encontrado"
        )
    if current_user.rol != "admin" and vehiculo.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="El vehículo no pertenece al usuario"
        )
    
    # Verificar servicios
    servicios = []
    for servicio_id in cita_in.servicios_ids:
        servicio = db.query(ServicioModel).filter(
            ServicioModel.id == servicio_id,
            ServicioModel.disponible == True
        ).first()
        if not servicio:
            raise HTTPException(
                status_code=404,
                detail=f"Servicio {servicio_id} no encontrado o no disponible"
            )
        servicios.append(servicio)
    
    # Verificar disponibilidad de horario
    citas_existentes = db.query(CitaModel).filter(
        CitaModel.fecha_hora.between(
            cita_in.fecha_hora - timedelta(hours=1),
            cita_in.fecha_hora + timedelta(hours=1)
        ),
        CitaModel.estado.in_([EstadoCita.PENDIENTE, EstadoCita.CONFIRMADA, EstadoCita.EN_PROCESO])
    ).all()
    
    if citas_existentes:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una cita en ese horario"
        )
    
    # Crear la cita
    cita = CitaModel(
        usuario_id=cita_in.usuario_id,
        vehiculo_id=cita_in.vehiculo_id,
        fecha_hora=cita_in.fecha_hora,
        estado=EstadoCita.PENDIENTE,
        notas_cliente=cita_in.notas_cliente
    )
    db.add(cita)
    db.commit()
    
    # Agregar servicios
    for servicio in servicios:
        cita.servicios.append(servicio)
    
    db.commit()
    db.refresh(cita)
    
    # Enviar email de confirmación
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == cita_in.usuario_id).first()
    background_tasks.add_task(
        email_service.send_cita_confirmacion,
        email_to=usuario.email,
        nombre=usuario.nombre,
        fecha=cita.fecha_hora.strftime("%d/%m/%Y %H:%M"),
        servicios=[s.nombre for s in servicios]
    )
    
    return cita

@router.get("/{cita_id}", response_model=CitaWithRelations)
def read_cita(
    *,
    db: Session = Depends(deps.get_db),
    cita_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener una cita por ID.
    - Administradores y técnicos pueden ver cualquier cita
    - Clientes solo pueden ver sus propias citas
    """
    cita = db.query(CitaModel).filter(CitaModel.id == cita_id).first()
    if not cita:
        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )
    
    if current_user.rol not in ["admin", "tecnico"] and cita.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para ver esta cita"
        )
    return cita

@router.put("/{cita_id}", response_model=Cita)
async def update_cita(
    *,
    db: Session = Depends(deps.get_db),
    cita_id: int,
    cita_in: CitaUpdate,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
    background_tasks: BackgroundTasks
) -> Any:
    """
    Actualizar una cita.
    - Administradores pueden actualizar cualquier cita
    - Técnicos pueden actualizar citas asignadas
    - Clientes solo pueden actualizar sus propias citas pendientes
    """
    cita = db.query(CitaModel).filter(CitaModel.id == cita_id).first()
    if not cita:
        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )
    
    # Verificar permisos
    if current_user.rol == "cliente":
        if cita.usuario_id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="No tiene permisos para modificar esta cita"
            )
        if cita.estado != EstadoCita.PENDIENTE:
            raise HTTPException(
                status_code=400,
                detail="Solo puede modificar citas pendientes"
            )
    elif current_user.rol == "tecnico":
        if cita.tecnico_asignado_id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="No tiene permisos para modificar esta cita"
            )
    
    # Actualizar campos
    update_data = cita_in.model_dump(exclude_unset=True)
    
    # Si se actualizan servicios
    servicios = []
    if "servicios_ids" in update_data:
        # Verificar servicios
        for servicio_id in update_data["servicios_ids"]:
            servicio = db.query(ServicioModel).filter(
                ServicioModel.id == servicio_id,
                ServicioModel.disponible == True
            ).first()
            if not servicio:
                raise HTTPException(
                    status_code=404,
                    detail=f"Servicio {servicio_id} no encontrado o no disponible"
                )
            servicios.append(servicio)
        
        # Actualizar servicios
        cita.servicios = servicios
        del update_data["servicios_ids"]
    
    # Actualizar resto de campos
    for field, value in update_data.items():
        setattr(cita, field, value)
    
    db.add(cita)
    db.commit()
    db.refresh(cita)
    
    # Si se confirma la cita, enviar recordatorio
    if cita.estado == EstadoCita.CONFIRMADA:
        usuario = db.query(UsuarioModel).filter(UsuarioModel.id == cita.usuario_id).first()
        background_tasks.add_task(
            email_service.send_recordatorio_cita,
            email_to=usuario.email,
            nombre=usuario.nombre,
            fecha=cita.fecha_hora.strftime("%d/%m/%Y %H:%M"),
            servicios=[s.nombre for s in cita.servicios]
        )
    
    return cita

@router.delete("/{cita_id}", response_model=Cita)
def delete_cita(
    *,
    db: Session = Depends(deps.get_db),
    cita_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Cancelar una cita.
    - Administradores pueden cancelar cualquier cita
    - Clientes solo pueden cancelar sus propias citas pendientes
    """
    cita = db.query(CitaModel).filter(CitaModel.id == cita_id).first()
    if not cita:
        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )
    
    if current_user.rol == "cliente":
        if cita.usuario_id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="No tiene permisos para cancelar esta cita"
            )
        if cita.estado != EstadoCita.PENDIENTE:
            raise HTTPException(
                status_code=400,
                detail="Solo puede cancelar citas pendientes"
            )
    
    cita.estado = EstadoCita.CANCELADA
    db.add(cita)
    db.commit()
    db.refresh(cita)
    return cita

@router.get("/tecnico/asignadas", response_model=List[CitaWithRelations])
def get_citas_tecnico(
    db: Session = Depends(deps.get_db),
    current_user: UsuarioModel = Depends(deps.get_current_tecnico_user),
) -> Any:
    """
    Obtener citas asignadas al técnico.
    Solo para técnicos.
    """
    return db.query(CitaModel).filter(CitaModel.tecnico_asignado_id == current_user.id).all()

@router.get("/fecha/{fecha}", response_model=List[CitaWithRelations])
def get_citas_by_fecha(
    *,
    db: Session = Depends(deps.get_db),
    fecha: str,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener citas por fecha.
    - Administradores y técnicos pueden ver todas las citas
    - Clientes solo pueden ver sus propias citas
    """
    try:
        fecha_dt = datetime.strptime(fecha, "%Y-%m-%d")
        fecha_siguiente = fecha_dt + timedelta(days=1)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Formato de fecha inválido. Use YYYY-MM-DD"
        )
    
    query = db.query(CitaModel).filter(
        CitaModel.fecha_hora >= fecha_dt,
        CitaModel.fecha_hora < fecha_siguiente
    )
    
    if current_user.rol not in ["admin", "tecnico"]:
        query = query.filter(CitaModel.usuario_id == current_user.id)
    
    return query.all() 