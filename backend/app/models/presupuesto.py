from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Enum, JSON
from sqlalchemy.orm import relationship
import enum
from .base import Base

class EstadoPresupuesto(str, enum.Enum):
    PENDIENTE = "pendiente"
    ACEPTADO = "aceptado"
    RECHAZADO = "rechazado"
    EXPIRADO = "expirado"

class Presupuesto(Base):
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    vehiculo_id = Column(Integer, ForeignKey("vehiculo.id"), nullable=False)
    fecha_emision = Column(DateTime, nullable=False)
    fecha_validez = Column(DateTime, nullable=False)
    items = Column(JSON, nullable=False)  # Lista de PresupuestoItem
    subtotal = Column(Float, nullable=False)
    impuestos = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    estado = Column(Enum(EstadoPresupuesto), nullable=False, default=EstadoPresupuesto.PENDIENTE)
    notas = Column(String)

    # Relaciones
    usuario = relationship("Usuario", backref="presupuestos")
    vehiculo = relationship("Vehiculo", backref="presupuestos")
    cita = relationship("Cita", back_populates="presupuesto", uselist=False)

    def __repr__(self):
        return f"<Presupuesto {self.fecha_emision} - {self.total}>" 