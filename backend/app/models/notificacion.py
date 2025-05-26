from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
import enum
from app.models.base import Base

class TipoNotificacion(str, enum.Enum):
    SISTEMA = "sistema"
    CITA = "cita"
    SERVICIO = "servicio"
    RECORDATORIO = "recordatorio"

class EstadoNotificacion(str, enum.Enum):
    LEIDA = "leida"
    NO_LEIDA = "no_leida"

class Notificacion(Base):
    __tablename__ = "notificaciones"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    mensaje = Column(String(1000), nullable=False)
    tipo = Column(Enum(TipoNotificacion), default=TipoNotificacion.SISTEMA)
    estado = Column(Enum(EstadoNotificacion), default=EstadoNotificacion.NO_LEIDA)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_lectura = Column(DateTime, nullable=True)
    leida = Column(Boolean, default=False)
    usuario_id = Column(Integer, ForeignKey('usuarios.id', ondelete='CASCADE'), nullable=False)
    cita_id = Column(Integer, ForeignKey('citas.id', ondelete='SET NULL'), nullable=True)
    presupuesto_id = Column(Integer, ForeignKey('presupuestos.id', ondelete='SET NULL'), nullable=True)
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="notificaciones")
    cita = relationship("Cita", back_populates="notificaciones")
    presupuesto = relationship("Presupuesto", back_populates="notificaciones")
    
    def __repr__(self):
        return f"<Notificacion {self.titulo}>" 