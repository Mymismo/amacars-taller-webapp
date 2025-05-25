from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import create_access_token, verify_password
from app.core.config import settings
from app.api import deps
from app.schemas.usuario import Token, Usuario, UsuarioCreate
from app.models.usuario import Usuario as UsuarioModel

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    Autenticación OAuth2 usando email y contraseña
    """
    user = db.query(UsuarioModel).filter(UsuarioModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.email, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/registro", response_model=Usuario)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UsuarioCreate,
) -> Any:
    """
    Registrar un nuevo usuario.
    """
    user = db.query(UsuarioModel).filter(UsuarioModel.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado en el sistema"
        )
    
    user = UsuarioModel(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        nombre=user_in.nombre,
        apellido=user_in.apellido,
        telefono=user_in.telefono,
        direccion=user_in.direccion,
        rol=user_in.rol,
        activo=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/test-token", response_model=Usuario)
def test_token(current_user: UsuarioModel = Depends(deps.get_current_user)) -> Any:
    """
    Probar token de acceso.
    """
    return current_user 