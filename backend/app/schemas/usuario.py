from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from .base import BaseSchema, IDSchema, TimestampSchema
from app.models.usuario import RolUsuario
from pydantic import ConfigDict

# Esquema base para Usuario
class UsuarioBase(BaseModel):
    email: EmailStr
    nombre: str
    apellidos: str
    telefono: str
    rol: RolUsuario = RolUsuario.CLIENTE
    es_activo: bool = True
    es_superusuario: bool = False
    model_config = ConfigDict(from_attributes=True)

# Esquema para crear Usuario
class UsuarioCreate(UsuarioBase):
    password: str

# Esquema para actualizar Usuario
class UsuarioUpdate(UsuarioBase):
    password: Optional[str] = None

# Esquema para respuesta de Usuario
class Usuario(UsuarioBase):
    id: int
    hashed_password: str

# Esquema para autenticación
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UsuarioBase
    model_config = ConfigDict(from_attributes=True)

class TokenPayload(BaseModel):
    sub: str
    exp: datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str 