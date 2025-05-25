from typing import Any, List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.presupuesto import Presupuesto, PresupuestoCreate, PresupuestoUpdate
from app.models.presupuesto import Presupuesto as PresupuestoModel, EstadoPresupuesto
from app.models.usuario import Usuario as UsuarioModel
from app.models.vehiculo import Vehiculo as VehiculoModel
from app.core.email import email_service
from app.core.pdf import pdf_service

router = APIRouter()

@router.get("/", response_model=List[Presupuesto])
def get_presupuestos(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener lista de presupuestos.
    - Administradores y técnicos pueden ver todos los presupuestos
    - Clientes solo pueden ver sus propios presupuestos
    """
    if current_user.rol in ["admin", "tecnico"]:
        return db.query(PresupuestoModel).offset(skip).limit(limit).all()
    return db.query(PresupuestoModel).filter(PresupuestoModel.usuario_id == current_user.id).all()

@router.post("/", response_model=Presupuesto)
async def create_presupuesto(
    *,
    db: Session = Depends(deps.get_db),
    presupuesto_in: PresupuestoCreate,
    current_user: UsuarioModel = Depends(deps.get_current_tecnico_user),
    background_tasks: BackgroundTasks
) -> Any:
    """
    Crear nuevo presupuesto.
    Solo técnicos y administradores pueden crear presupuestos.
    """
    # Verificar que el vehículo existe
    vehiculo = db.query(VehiculoModel).filter(VehiculoModel.id == presupuesto_in.vehiculo_id).first()
    if not vehiculo:
        raise HTTPException(
            status_code=404,
            detail="Vehículo no encontrado"
        )
    
    # Obtener usuario (cliente)
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == vehiculo.usuario_id).first()
    
    # Crear presupuesto
    presupuesto = PresupuestoModel(
        **presupuesto_in.model_dump(),
        fecha_emision=datetime.utcnow(),
        fecha_validez=datetime.utcnow() + timedelta(days=30)  # Validez por 30 días
    )
    db.add(presupuesto)
    db.commit()
    db.refresh(presupuesto)
    
    # Generar PDF
    pdf_path = pdf_service.generate_presupuesto(
        presupuesto_id=presupuesto.id,
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
            "precio": s.precio
        } for s in presupuesto.servicios],
        total=presupuesto.total,
        notas=presupuesto.notas
    )
    
    # Enviar email con el presupuesto
    background_tasks.add_task(
        email_service.send_presupuesto,
        email_to=usuario.email,
        nombre=usuario.nombre,
        presupuesto_id=presupuesto.id,
        total=presupuesto.total,
        pdf_path=pdf_path
    )
    
    return presupuesto

@router.get("/{presupuesto_id}", response_model=Presupuesto)
def read_presupuesto(
    *,
    db: Session = Depends(deps.get_db),
    presupuesto_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener un presupuesto por ID.
    - Administradores y técnicos pueden ver cualquier presupuesto
    - Clientes solo pueden ver sus propios presupuestos
    """
    presupuesto = db.query(PresupuestoModel).filter(PresupuestoModel.id == presupuesto_id).first()
    if not presupuesto:
        raise HTTPException(
            status_code=404,
            detail="Presupuesto no encontrado"
        )
    
    if current_user.rol not in ["admin", "tecnico"] and presupuesto.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para ver este presupuesto"
        )
    return presupuesto

@router.put("/{presupuesto_id}", response_model=Presupuesto)
def update_presupuesto(
    *,
    db: Session = Depends(deps.get_db),
    presupuesto_id: int,
    presupuesto_in: PresupuestoUpdate,
    current_user: UsuarioModel = Depends(deps.get_current_tecnico_user),
) -> Any:
    """
    Actualizar un presupuesto.
    Solo técnicos y administradores pueden actualizar presupuestos.
    """
    presupuesto = db.query(PresupuestoModel).filter(PresupuestoModel.id == presupuesto_id).first()
    if not presupuesto:
        raise HTTPException(
            status_code=404,
            detail="Presupuesto no encontrado"
        )
    
    if presupuesto.estado in [EstadoPresupuesto.ACEPTADO, EstadoPresupuesto.RECHAZADO]:
        raise HTTPException(
            status_code=400,
            detail="No se puede modificar un presupuesto que ya ha sido aceptado o rechazado"
        )
    
    update_data = presupuesto_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(presupuesto, field, value)
    
    db.add(presupuesto)
    db.commit()
    db.refresh(presupuesto)
    return presupuesto

@router.post("/{presupuesto_id}/aceptar", response_model=Presupuesto)
def aceptar_presupuesto(
    *,
    db: Session = Depends(deps.get_db),
    presupuesto_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Aceptar un presupuesto.
    - Solo el cliente dueño del presupuesto puede aceptarlo
    - El presupuesto debe estar pendiente y dentro del período de validez
    """
    presupuesto = db.query(PresupuestoModel).filter(PresupuestoModel.id == presupuesto_id).first()
    if not presupuesto:
        raise HTTPException(
            status_code=404,
            detail="Presupuesto no encontrado"
        )
    
    if current_user.rol != "admin" and presupuesto.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para aceptar este presupuesto"
        )
    
    if presupuesto.estado != EstadoPresupuesto.PENDIENTE:
        raise HTTPException(
            status_code=400,
            detail="El presupuesto ya no está pendiente"
        )
    
    if presupuesto.fecha_validez < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="El presupuesto ha expirado"
        )
    
    presupuesto.estado = EstadoPresupuesto.ACEPTADO
    db.add(presupuesto)
    db.commit()
    db.refresh(presupuesto)
    return presupuesto

@router.post("/{presupuesto_id}/rechazar", response_model=Presupuesto)
def rechazar_presupuesto(
    *,
    db: Session = Depends(deps.get_db),
    presupuesto_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Rechazar un presupuesto.
    - Solo el cliente dueño del presupuesto puede rechazarlo
    - El presupuesto debe estar pendiente
    """
    presupuesto = db.query(PresupuestoModel).filter(PresupuestoModel.id == presupuesto_id).first()
    if not presupuesto:
        raise HTTPException(
            status_code=404,
            detail="Presupuesto no encontrado"
        )
    
    if current_user.rol != "admin" and presupuesto.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para rechazar este presupuesto"
        )
    
    if presupuesto.estado != EstadoPresupuesto.PENDIENTE:
        raise HTTPException(
            status_code=400,
            detail="El presupuesto ya no está pendiente"
        )
    
    presupuesto.estado = EstadoPresupuesto.RECHAZADO
    db.add(presupuesto)
    db.commit()
    db.refresh(presupuesto)
    return presupuesto

@router.get("/vehiculo/{vehiculo_id}", response_model=List[Presupuesto])
def get_presupuestos_by_vehiculo(
    *,
    db: Session = Depends(deps.get_db),
    vehiculo_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener presupuestos por vehículo.
    - Administradores y técnicos pueden ver todos los presupuestos
    - Clientes solo pueden ver presupuestos de sus vehículos
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
            detail="No tiene permisos para ver los presupuestos de este vehículo"
        )
    
    return db.query(PresupuestoModel).filter(PresupuestoModel.vehiculo_id == vehiculo_id).all() 