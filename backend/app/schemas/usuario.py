from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from .base import BaseSchema, IDSchema, TimestampSchema
from app.models.usuario import RolUsuario

# Esquema base para Usuario
class UsuarioBase(BaseSchema):
    email: EmailStr
    nombre: str
    apellido: str
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    rol: RolUsuario = RolUsuario.CLIENTE
    activo: bool = True
    grupo_id: Optional[int] = None

# Esquema para crear Usuario
class UsuarioCreate(UsuarioBase):
    password: str

# Esquema para actualizar Usuario
class UsuarioUpdate(BaseSchema):
    email: Optional[EmailStr] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    password: Optional[str] = None
    activo: Optional[bool] = None
    grupo_id: Optional[int] = None

# Esquema para respuesta de Usuario
class Usuario(UsuarioBase, IDSchema, TimestampSchema):
    fecha_registro: datetime
    ultima_conexion: Optional[datetime] = None

# Esquema para autenticación
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str
    exp: datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str 