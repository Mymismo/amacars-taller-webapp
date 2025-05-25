from typing import Any, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.historial_servicio import (
    HistorialServicio,
    HistorialServicioCreate,
    HistorialServicioUpdate,
    ServicioRealizado,
    ServicioRealizadoCreate
)
from app.models.historial_servicio import (
    HistorialServicio as HistorialServicioModel,
    ServicioRealizado as ServicioRealizadoModel
)
from app.models.usuario import Usuario as UsuarioModel
from app.models.vehiculo import Vehiculo as VehiculoModel
from app.models.cita import Cita as CitaModel
from app.core.email import email_service
from app.core.pdf import pdf_service

router = APIRouter()

@router.get("/", response_model=List[HistorialServicio])
def get_historiales(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener lista de historiales de servicio.
    - Administradores y técnicos pueden ver todos los historiales
    - Clientes solo pueden ver historiales de sus vehículos
    """
    if current_user.rol in ["admin", "tecnico"]:
        return db.query(HistorialServicioModel).offset(skip).limit(limit).all()
    
    # Para clientes, obtener sus vehículos y luego los historiales
    vehiculos = db.query(VehiculoModel).filter(VehiculoModel.usuario_id == current_user.id).all()
    vehiculos_ids = [v.id for v in vehiculos]
    return db.query(HistorialServicioModel).filter(
        HistorialServicioModel.vehiculo_id.in_(vehiculos_ids)
    ).all()

@router.post("/", response_model=HistorialServicio)
async def create_historial(
    *,
    db: Session = Depends(deps.get_db),
    historial_in: HistorialServicioCreate,
    current_user: UsuarioModel = Depends(deps.get_current_tecnico_user),
    background_tasks: BackgroundTasks
) -> Any:
    """
    Crear nuevo historial de servicio.
    Solo técnicos y administradores.
    """
    # Verificar que la cita existe
    cita = db.query(CitaModel).filter(CitaModel.id == historial_in.cita_id).first()
    if not cita:
        raise HTTPException(
            status_code=404,
            detail="Cita no encontrada"
        )
    
    # Verificar que el vehículo existe
    vehiculo = db.query(VehiculoModel).filter(VehiculoModel.id == historial_in.vehiculo_id).first()
    if not vehiculo:
        raise HTTPException(
            status_code=404,
            detail="Vehículo no encontrado"
        )
    
    # Obtener usuario (cliente)
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == vehiculo.usuario_id).first()
    
    # Crear el historial
    historial = HistorialServicioModel(
        **historial_in.model_dump(exclude={"servicios_realizados"}),
        fecha_inicio=datetime.utcnow()
    )
    db.add(historial)
    db.commit()
    db.refresh(historial)
    
    # Crear los servicios realizados
    servicios_realizados = []
    for servicio_data in historial_in.servicios_realizados:
        servicio = ServicioRealizadoModel(
            historial_id=historial.id,
            **servicio_data.model_dump()
        )
        db.add(servicio)
        servicios_realizados.append(servicio)
    
    db.commit()
    db.refresh(historial)
    
    # Generar PDF del informe
    pdf_path = pdf_service.generate_informe_servicio(
        historial_id=historial.id,
        cliente={
            "nombre": usuario.nombre,
            "email": usuario.email
        },
        vehiculo={
            "marca": vehiculo.marca,
            "modelo": vehiculo.modelo,
            "placa": vehiculo.placa
        },
        servicios=[{
            "nombre": s.nombre,
            "descripcion": s.descripcion,
            "observaciones": s.observaciones
        } for s in servicios_realizados],
        tecnico={
            "nombre": current_user.nombre
        },
        fecha=historial.fecha_inicio,
        observaciones=historial.observaciones
    )
    
    # Enviar email con el informe
    background_tasks.add_task(
        email_service.send_notificacion_servicio_completado,
        email_to=usuario.email,
        nombre=usuario.nombre,
        vehiculo=f"{vehiculo.marca} {vehiculo.modelo}",
        servicios=[s.nombre for s in servicios_realizados],
        pdf_path=pdf_path
    )
    
    return historial

@router.get("/{historial_id}", response_model=HistorialServicio)
def read_historial(
    *,
    db: Session = Depends(deps.get_db),
    historial_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener un historial por ID.
    - Administradores y técnicos pueden ver cualquier historial
    - Clientes solo pueden ver historiales de sus vehículos
    """
    historial = db.query(HistorialServicioModel).filter(HistorialServicioModel.id == historial_id).first()
    if not historial:
        raise HTTPException(
            status_code=404,
            detail="Historial no encontrado"
        )
    
    if current_user.rol not in ["admin", "tecnico"]:
        vehiculo = db.query(VehiculoModel).filter(VehiculoModel.id == historial.vehiculo_id).first()
        if vehiculo.usuario_id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="No tiene permisos para ver este historial"
            )
    
    return historial

@router.put("/{historial_id}", response_model=HistorialServicio)
def update_historial(
    *,
    db: Session = Depends(deps.get_db),
    historial_id: int,
    historial_in: HistorialServicioUpdate,
    current_user: UsuarioModel = Depends(deps.get_current_tecnico_user),
) -> Any:
    """
    Actualizar un historial.
    Solo técnicos y administradores.
    """
    historial = db.query(HistorialServicioModel).filter(HistorialServicioModel.id == historial_id).first()
    if not historial:
        raise HTTPException(
            status_code=404,
            detail="Historial no encontrado"
        )
    
    # Actualizar campos básicos
    update_data = historial_in.model_dump(exclude={"servicios_realizados"}, exclude_unset=True)
    for field, value in update_data.items():
        setattr(historial, field, value)
    
    # Si se actualizan los servicios realizados
    if historial_in.servicios_realizados:
        # Eliminar servicios anteriores
        db.query(ServicioRealizadoModel).filter(
            ServicioRealizadoModel.historial_id == historial.id
        ).delete()
        
        # Crear nuevos servicios
        for servicio_data in historial_in.servicios_realizados:
            servicio = ServicioRealizadoModel(
                historial_id=historial.id,
                **servicio_data.model_dump()
            )
            db.add(servicio)
    
    db.add(historial)
    db.commit()
    db.refresh(historial)
    return historial

@router.delete("/{historial_id}", response_model=HistorialServicio)
def delete_historial(
    *,
    db: Session = Depends(deps.get_db),
    historial_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Eliminar un historial.
    Solo administradores.
    """
    historial = db.query(HistorialServicioModel).filter(HistorialServicioModel.id == historial_id).first()
    if not historial:
        raise HTTPException(
            status_code=404,
            detail="Historial no encontrado"
        )
    
    # Eliminar servicios realizados asociados
    db.query(ServicioRealizadoModel).filter(
        ServicioRealizadoModel.historial_id == historial.id
    ).delete()
    
    db.delete(historial)
    db.commit()
    return historial

@router.get("/vehiculo/{vehiculo_id}", response_model=List[HistorialServicio])
def get_historial_by_vehiculo(
    *,
    db: Session = Depends(deps.get_db),
    vehiculo_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener historial por vehículo.
    - Administradores y técnicos pueden ver cualquier historial
    - Clientes solo pueden ver historiales de sus vehículos
    """
    # Verificar que el vehículo existe
    vehiculo = db.query(VehiculoModel).filter(VehiculoModel.id == vehiculo_id).first()
    if not vehiculo:
        raise HTTPException(
            status_code=404,
            detail="Vehículo no encontrado"
        )
    
    # Verificar permisos
    if current_user.rol not in ["admin", "tecnico"] and vehiculo.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para ver el historial de este vehículo"
        )
    
    return db.query(HistorialServicioModel).filter(
        HistorialServicioModel.vehiculo_id == vehiculo_id
    ).order_by(HistorialServicioModel.fecha_inicio.desc()).all()

@router.get("/tecnico/{tecnico_id}", response_model=List[HistorialServicio])
def get_historial_by_tecnico(
    *,
    db: Session = Depends(deps.get_db),
    tecnico_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_tecnico_user),
) -> Any:
    """
    Obtener historial por técnico.
    Solo técnicos y administradores.
    """
    # Verificar que el técnico existe
    tecnico = db.query(UsuarioModel).filter(
        UsuarioModel.id == tecnico_id,
        UsuarioModel.rol == "tecnico"
    ).first()
    if not tecnico:
        raise HTTPException(
            status_code=404,
            detail="Técnico no encontrado"
        )
    
    return db.query(HistorialServicioModel).filter(
        HistorialServicioModel.tecnico_id == tecnico_id
    ).order_by(HistorialServicioModel.fecha_inicio.desc()).all() 