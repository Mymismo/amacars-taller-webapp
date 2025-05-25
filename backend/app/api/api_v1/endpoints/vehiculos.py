from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.vehiculo import Vehiculo, VehiculoCreate, VehiculoUpdate
from app.models.vehiculo import Vehiculo as VehiculoModel
from app.models.usuario import Usuario as UsuarioModel

router = APIRouter()

@router.get("/", response_model=List[Vehiculo])
def get_vehiculos(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener lista de vehículos.
    - Administradores y técnicos pueden ver todos los vehículos
    - Clientes solo pueden ver sus propios vehículos
    """
    if current_user.rol in ["admin", "tecnico"]:
        return db.query(VehiculoModel).offset(skip).limit(limit).all()
    return db.query(VehiculoModel).filter(VehiculoModel.usuario_id == current_user.id).all()

@router.post("/", response_model=Vehiculo)
def create_vehiculo(
    *,
    db: Session = Depends(deps.get_db),
    vehiculo_in: VehiculoCreate,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Crear nuevo vehículo.
    - Administradores pueden crear vehículos para cualquier usuario
    - Clientes solo pueden crear vehículos para sí mismos
    """
    if current_user.rol != "admin" and vehiculo_in.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No puede crear vehículos para otros usuarios"
        )
    
    # Verificar si la placa ya existe
    if db.query(VehiculoModel).filter(VehiculoModel.placa == vehiculo_in.placa).first():
        raise HTTPException(
            status_code=400,
            detail="Ya existe un vehículo con esa placa"
        )
    
    vehiculo = VehiculoModel(**vehiculo_in.model_dump())
    db.add(vehiculo)
    db.commit()
    db.refresh(vehiculo)
    return vehiculo

@router.get("/{vehiculo_id}", response_model=Vehiculo)
def read_vehiculo(
    *,
    db: Session = Depends(deps.get_db),
    vehiculo_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener un vehículo por ID.
    - Administradores y técnicos pueden ver cualquier vehículo
    - Clientes solo pueden ver sus propios vehículos
    """
    vehiculo = db.query(VehiculoModel).filter(VehiculoModel.id == vehiculo_id).first()
    if not vehiculo:
        raise HTTPException(
            status_code=404,
            detail="Vehículo no encontrado"
        )
    
    if current_user.rol not in ["admin", "tecnico"] and vehiculo.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para ver este vehículo"
        )
    return vehiculo

@router.put("/{vehiculo_id}", response_model=Vehiculo)
def update_vehiculo(
    *,
    db: Session = Depends(deps.get_db),
    vehiculo_id: int,
    vehiculo_in: VehiculoUpdate,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Actualizar un vehículo.
    - Administradores pueden actualizar cualquier vehículo
    - Clientes solo pueden actualizar sus propios vehículos
    """
    vehiculo = db.query(VehiculoModel).filter(VehiculoModel.id == vehiculo_id).first()
    if not vehiculo:
        raise HTTPException(
            status_code=404,
            detail="Vehículo no encontrado"
        )
    
    if current_user.rol != "admin" and vehiculo.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para modificar este vehículo"
        )
    
    # Actualizar campos
    update_data = vehiculo_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehiculo, field, value)
    
    db.add(vehiculo)
    db.commit()
    db.refresh(vehiculo)
    return vehiculo

@router.delete("/{vehiculo_id}", response_model=Vehiculo)
def delete_vehiculo(
    *,
    db: Session = Depends(deps.get_db),
    vehiculo_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Eliminar un vehículo.
    - Administradores pueden eliminar cualquier vehículo
    - Clientes solo pueden eliminar sus propios vehículos
    """
    vehiculo = db.query(VehiculoModel).filter(VehiculoModel.id == vehiculo_id).first()
    if not vehiculo:
        raise HTTPException(
            status_code=404,
            detail="Vehículo no encontrado"
        )
    
    if current_user.rol != "admin" and vehiculo.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para eliminar este vehículo"
        )
    
    db.delete(vehiculo)
    db.commit()
    return vehiculo 