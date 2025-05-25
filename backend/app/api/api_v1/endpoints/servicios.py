from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.servicio import Servicio, ServicioCreate, ServicioUpdate, ServicioWithRelations
from app.models.servicio import Servicio as ServicioModel
from app.models.usuario import Usuario as UsuarioModel

router = APIRouter()

@router.get("/", response_model=List[Servicio])
def get_servicios(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener lista de servicios.
    Todos los usuarios pueden ver los servicios disponibles.
    """
    return db.query(ServicioModel).filter(ServicioModel.disponible == True).offset(skip).limit(limit).all()

@router.get("/admin", response_model=List[ServicioWithRelations])
def get_all_servicios(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Obtener lista completa de servicios (incluyendo no disponibles).
    Solo administradores.
    """
    return db.query(ServicioModel).offset(skip).limit(limit).all()

@router.post("/", response_model=Servicio)
def create_servicio(
    *,
    db: Session = Depends(deps.get_db),
    servicio_in: ServicioCreate,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Crear nuevo servicio.
    Solo administradores pueden crear servicios.
    """
    servicio = ServicioModel(**servicio_in.model_dump())
    db.add(servicio)
    db.commit()
    db.refresh(servicio)
    return servicio

@router.get("/{servicio_id}", response_model=ServicioWithRelations)
def read_servicio(
    *,
    db: Session = Depends(deps.get_db),
    servicio_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener un servicio por ID.
    """
    servicio = db.query(ServicioModel).filter(ServicioModel.id == servicio_id).first()
    if not servicio:
        raise HTTPException(
            status_code=404,
            detail="Servicio no encontrado"
        )
    
    # Si no es admin y el servicio no está disponible, no permitir acceso
    if current_user.rol != "admin" and not servicio.disponible:
        raise HTTPException(
            status_code=404,
            detail="Servicio no encontrado"
        )
    return servicio

@router.put("/{servicio_id}", response_model=Servicio)
def update_servicio(
    *,
    db: Session = Depends(deps.get_db),
    servicio_id: int,
    servicio_in: ServicioUpdate,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Actualizar un servicio.
    Solo administradores pueden actualizar servicios.
    """
    servicio = db.query(ServicioModel).filter(ServicioModel.id == servicio_id).first()
    if not servicio:
        raise HTTPException(
            status_code=404,
            detail="Servicio no encontrado"
        )
    
    update_data = servicio_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(servicio, field, value)
    
    db.add(servicio)
    db.commit()
    db.refresh(servicio)
    return servicio

@router.delete("/{servicio_id}", response_model=Servicio)
def delete_servicio(
    *,
    db: Session = Depends(deps.get_db),
    servicio_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Eliminar un servicio.
    Solo administradores pueden eliminar servicios.
    """
    servicio = db.query(ServicioModel).filter(ServicioModel.id == servicio_id).first()
    if not servicio:
        raise HTTPException(
            status_code=404,
            detail="Servicio no encontrado"
        )
    
    # Verificar si el servicio tiene citas asociadas
    if servicio.citas:
        # En lugar de eliminar, marcar como no disponible
        servicio.disponible = False
        db.add(servicio)
        db.commit()
        db.refresh(servicio)
        return servicio
    
    db.delete(servicio)
    db.commit()
    return servicio

@router.get("/categoria/{categoria}", response_model=List[Servicio])
def get_servicios_by_categoria(
    *,
    db: Session = Depends(deps.get_db),
    categoria: str,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener servicios por categoría.
    """
    servicios = db.query(ServicioModel).filter(
        ServicioModel.categoria == categoria,
        ServicioModel.disponible == True
    ).all()
    return servicios 