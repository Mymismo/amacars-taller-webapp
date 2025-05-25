from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.usuario import Usuario, UsuarioCreate, UsuarioUpdate
from app.models.usuario import Usuario as UsuarioModel
from app.core.security import get_password_hash

router = APIRouter()

@router.get("/", response_model=List[Usuario])
def get_usuarios(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Obtener lista de usuarios.
    Solo administradores pueden ver todos los usuarios.
    """
    usuarios = db.query(UsuarioModel).offset(skip).limit(limit).all()
    return usuarios

@router.post("/", response_model=Usuario)
def create_usuario(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UsuarioCreate,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Crear nuevo usuario.
    Solo administradores pueden crear otros usuarios.
    """
    user = db.query(UsuarioModel).filter(UsuarioModel.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="El email ya está registrado en el sistema",
        )
    user = UsuarioModel(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        nombre=user_in.nombre,
        apellido=user_in.apellido,
        telefono=user_in.telefono,
        direccion=user_in.direccion,
        rol=user_in.rol,
        activo=True,
        grupo_id=user_in.grupo_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/me", response_model=Usuario)
def read_user_me(
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener usuario actual.
    """
    return current_user

@router.put("/me", response_model=Usuario)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    password: str = Body(None),
    nombre: str = Body(None),
    apellido: str = Body(None),
    telefono: str = Body(None),
    direccion: str = Body(None),
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Actualizar datos del usuario actual.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = UsuarioUpdate(**current_user_data)
    if password is not None:
        user_in.password = password
    if nombre is not None:
        user_in.nombre = nombre
    if apellido is not None:
        user_in.apellido = apellido
    if telefono is not None:
        user_in.telefono = telefono
    if direccion is not None:
        user_in.direccion = direccion
    
    if user_in.password:
        current_user.hashed_password = get_password_hash(user_in.password)
    if user_in.nombre:
        current_user.nombre = user_in.nombre
    if user_in.apellido:
        current_user.apellido = user_in.apellido
    if user_in.telefono:
        current_user.telefono = user_in.telefono
    if user_in.direccion:
        current_user.direccion = user_in.direccion
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/{user_id}", response_model=Usuario)
def read_user_by_id(
    user_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Obtener un usuario por ID.
    """
    user = db.query(UsuarioModel).filter(UsuarioModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado",
        )
    if user == current_user:
        return user
    if not current_user.rol == "admin":
        raise HTTPException(
            status_code=400,
            detail="No tiene suficientes permisos",
        )
    return user

@router.put("/{user_id}", response_model=Usuario)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: UsuarioUpdate,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Actualizar usuario.
    Solo administradores pueden actualizar otros usuarios.
    """
    user = db.query(UsuarioModel).filter(UsuarioModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado",
        )
    
    if user_in.password:
        user.hashed_password = get_password_hash(user_in.password)
    if user_in.email:
        user.email = user_in.email
    if user_in.nombre:
        user.nombre = user_in.nombre
    if user_in.apellido:
        user.apellido = user_in.apellido
    if user_in.telefono:
        user.telefono = user_in.telefono
    if user_in.direccion:
        user.direccion = user_in.direccion
    if user_in.activo is not None:
        user.activo = user_in.activo
    if user_in.grupo_id:
        user.grupo_id = user_in.grupo_id
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", response_model=Usuario)
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Eliminar usuario.
    Solo administradores pueden eliminar usuarios.
    """
    user = db.query(UsuarioModel).filter(UsuarioModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado",
        )
    db.delete(user)
    db.commit()
    return user 