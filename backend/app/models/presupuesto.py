from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class EstadoPresupuesto(str, enum.Enum):
    PENDIENTE = "pendiente"
    APROBADO = "aprobado"
    RECHAZADO = "rechazado"
    COMPLETADO = "completado"

class Presupuesto(Base):
    __tablename__ = "presupuestos"

    id = Column(Integer, primary_key=True, index=True)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    descripcion = Column(String(500))
    mano_obra = Column(Float, default=0.0)
    costo_piezas = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    estado = Column(Enum(EstadoPresupuesto), default=EstadoPresupuesto.PENDIENTE)
    notas = Column(String(1000))
    
    # Relaciones
    cita = relationship("Cita", back_populates="presupuesto", uselist=False)
    notificaciones = relationship("Notificacion", back_populates="presupuesto")
    
    def __repr__(self):
        return f"<Presupuesto {self.id} - {self.total}€>" 