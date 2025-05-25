from typing import Optional
from datetime import datetime
from .base import BaseSchema, IDSchema, TimestampSchema
from app.models.notificacion import TipoNotificacion

class NotificacionBase(BaseSchema):
    usuario_id: int
    tipo: TipoNotificacion
    titulo: str
    mensaje: str
    fecha: datetime
    leida: bool = False
    accion: Optional[str] = None
    grupo_id: Optional[int] = None

class NotificacionCreate(NotificacionBase):
    pass

class NotificacionUpdate(BaseSchema):
    titulo: Optional[str] = None
    mensaje: Optional[str] = None
    leida: Optional[bool] = None
    accion: Optional[str] = None

class Notificacion(NotificacionBase, IDSchema, TimestampSchema):
    pass 