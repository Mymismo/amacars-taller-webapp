from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from .base import BaseSchema, IDSchema, TimestampSchema
from app.models.notificacion import TipoNotificacion, EstadoNotificacion

class NotificacionBase(BaseSchema):
    titulo: str
    mensaje: str
    tipo: TipoNotificacion
    estado: EstadoNotificacion = EstadoNotificacion.NO_LEIDA
    usuario_id: int
    fecha_lectura: Optional[datetime] = None
    cita_id: Optional[int] = None
    presupuesto_id: Optional[int] = None

class NotificacionCreate(NotificacionBase):
    pass

class NotificacionUpdate(NotificacionBase):
    pass

class Notificacion(NotificacionBase, IDSchema, TimestampSchema):
    pass 