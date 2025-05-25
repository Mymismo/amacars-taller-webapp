from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.grupo_clientes import GrupoClientes, GrupoClientesCreate, GrupoClientesUpdate, GrupoClientesWithRelations
from app.models.grupo_clientes import GrupoClientes as GrupoClientesModel
from app.models.usuario import Usuario as UsuarioModel

router = APIRouter()

@router.get("/", response_model=List[GrupoClientesWithRelations])
def get_grupos(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Obtener lista de grupos de clientes.
    Solo administradores.
    """
    return db.query(GrupoClientesModel).offset(skip).limit(limit).all()

@router.post("/", response_model=GrupoClientes)
def create_grupo(
    *,
    db: Session = Depends(deps.get_db),
    grupo_in: GrupoClientesCreate,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Crear nuevo grupo de clientes.
    Solo administradores.
    """
    # Verificar que no exista un grupo con el mismo nombre
    if db.query(GrupoClientesModel).filter(GrupoClientesModel.nombre == grupo_in.nombre).first():
        raise HTTPException(
            status_code=400,
            detail="Ya existe un grupo con ese nombre"
        )
    
    grupo = GrupoClientesModel(**grupo_in.model_dump())
    db.add(grupo)
    db.commit()
    db.refresh(grupo)
    return grupo

@router.get("/{grupo_id}", response_model=GrupoClientesWithRelations)
def read_grupo(
    *,
    db: Session = Depends(deps.get_db),
    grupo_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Obtener un grupo por ID.
    Solo administradores.
    """
    grupo = db.query(GrupoClientesModel).filter(GrupoClientesModel.id == grupo_id).first()
    if not grupo:
        raise HTTPException(
            status_code=404,
            detail="Grupo no encontrado"
        )
    return grupo

@router.put("/{grupo_id}", response_model=GrupoClientes)
def update_grupo(
    *,
    db: Session = Depends(deps.get_db),
    grupo_id: int,
    grupo_in: GrupoClientesUpdate,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Actualizar un grupo.
    Solo administradores.
    """
    grupo = db.query(GrupoClientesModel).filter(GrupoClientesModel.id == grupo_id).first()
    if not grupo:
        raise HTTPException(
            status_code=404,
            detail="Grupo no encontrado"
        )
    
    # Si se está actualizando el nombre, verificar que no exista otro grupo con ese nombre
    if grupo_in.nombre and grupo_in.nombre != grupo.nombre:
        if db.query(GrupoClientesModel).filter(GrupoClientesModel.nombre == grupo_in.nombre).first():
            raise HTTPException(
                status_code=400,
                detail="Ya existe un grupo con ese nombre"
            )
    
    update_data = grupo_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(grupo, field, value)
    
    db.add(grupo)
    db.commit()
    db.refresh(grupo)
    return grupo

@router.delete("/{grupo_id}", response_model=GrupoClientes)
def delete_grupo(
    *,
    db: Session = Depends(deps.get_db),
    grupo_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Eliminar un grupo.
    Solo administradores.
    """
    grupo = db.query(GrupoClientesModel).filter(GrupoClientesModel.id == grupo_id).first()
    if not grupo:
        raise HTTPException(
            status_code=404,
            detail="Grupo no encontrado"
        )
    
    # Verificar si hay usuarios en el grupo
    if grupo.usuarios:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar un grupo que tiene usuarios asignados"
        )
    
    db.delete(grupo)
    db.commit()
    return grupo

@router.post("/{grupo_id}/usuarios/{usuario_id}", response_model=GrupoClientesWithRelations)
def add_usuario_to_grupo(
    *,
    db: Session = Depends(deps.get_db),
    grupo_id: int,
    usuario_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Agregar un usuario a un grupo.
    Solo administradores.
    """
    grupo = db.query(GrupoClientesModel).filter(GrupoClientesModel.id == grupo_id).first()
    if not grupo:
        raise HTTPException(
            status_code=404,
            detail="Grupo no encontrado"
        )
    
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == usuario_id).first()
    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    
    if usuario in grupo.usuarios:
        raise HTTPException(
            status_code=400,
            detail="El usuario ya pertenece a este grupo"
        )
    
    grupo.usuarios.append(usuario)
    db.commit()
    db.refresh(grupo)
    return grupo

@router.delete("/{grupo_id}/usuarios/{usuario_id}", response_model=GrupoClientesWithRelations)
def remove_usuario_from_grupo(
    *,
    db: Session = Depends(deps.get_db),
    grupo_id: int,
    usuario_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Remover un usuario de un grupo.
    Solo administradores.
    """
    grupo = db.query(GrupoClientesModel).filter(GrupoClientesModel.id == grupo_id).first()
    if not grupo:
        raise HTTPException(
            status_code=404,
            detail="Grupo no encontrado"
        )
    
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == usuario_id).first()
    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    
    if usuario not in grupo.usuarios:
        raise HTTPException(
            status_code=400,
            detail="El usuario no pertenece a este grupo"
        )
    
    grupo.usuarios.remove(usuario)
    db.commit()
    db.refresh(grupo)
    return grupo 