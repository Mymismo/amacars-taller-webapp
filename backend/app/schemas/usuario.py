from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from .base import BaseSchema, IDSchema, TimestampSchema
from app.models.usuario import RolUsuario

# Esquema base para Usuario
class UsuarioBase(BaseSchema):
    email: EmailStr
    nombre: Optional[str] = None
    apellidos: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    rol: Optional[RolUsuario] = RolUsuario.CLIENTE
    es_activo: bool = True
    es_superusuario: bool = False
    grupo_id: Optional[int] = None

# Esquema para crear Usuario
class UsuarioCreate(UsuarioBase):
    password: str

# Esquema para actualizar Usuario
class UsuarioUpdate(UsuarioBase):
    password: Optional[str] = None

# Esquema para respuesta de Usuario
class Usuario(UsuarioBase, IDSchema, TimestampSchema):
    pass

# Esquema para autenticación
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Usuario

class TokenPayload(BaseModel):
    sub: str
    exp: datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str 