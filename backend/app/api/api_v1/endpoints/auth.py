from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core import security
from app.core.security import get_password_hash
from app.api import deps
from app.models.usuario import Usuario
from app.schemas.usuario import Token, UsuarioCreate, Usuario as UsuarioSchema

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    Autenticación OAuth2 usando email y contraseña
    """
    usuario = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not security.verify_password(form_data.password, usuario.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not usuario.es_activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        usuario.id, expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=usuario
    )

@router.post("/registro", response_model=UsuarioSchema)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UsuarioCreate,
) -> Any:
    """
    Registrar un nuevo usuario.
    """
    try:
        # Verificar si el email ya existe
        user = db.query(Usuario).filter(Usuario.email == user_in.email).first()
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado en el sistema"
            )
        
        # Crear el nuevo usuario
        user = Usuario(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            nombre=user_in.nombre,
            apellidos=user_in.apellidos,
            telefono=user_in.telefono,
            direccion=user_in.direccion if hasattr(user_in, 'direccion') else None,
            rol=user_in.rol,
            es_activo=True,
            es_superusuario=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear el usuario: {str(e)}"
        )

@router.post("/test-token", response_model=UsuarioSchema)
def test_token(current_user: Usuario = Depends(deps.get_current_user)) -> Any:
    """
    Probar token de acceso.
    """
    return current_user 