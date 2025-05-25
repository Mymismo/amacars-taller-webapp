from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
import enum
from .base import Base

class TipoNotificacion(str, enum.Enum):
    SISTEMA = "sistema"
    CITA = "cita"
    PRESUPUESTO = "presupuesto"
    SERVICIO = "servicio"
    PROMOCION = "promocion"

class Notificacion(Base):
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    tipo = Column(Enum(TipoNotificacion), nullable=False)
    titulo = Column(String, nullable=False)
    mensaje = Column(String, nullable=False)
    fecha = Column(DateTime, nullable=False)
    leida = Column(Boolean, default=False)
    accion = Column(String)  # URL o acción a realizar
    grupo_id = Column(Integer, ForeignKey("grupoclientes.id"))

    # Relaciones
    usuario = relationship("Usuario", back_populates="notificaciones")
    grupo = relationship("GrupoClientes", back_populates="notificaciones")

    def __repr__(self):
        return f"<Notificacion {self.tipo} - {self.titulo}>" 