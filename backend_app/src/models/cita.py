from sqlalchemy import Column, Integer, DateTime, String, Text, ForeignKey, Enum, Numeric
from sqlalchemy.orm import relationship
import enum
from ..database.connection import Base

class EstadoCita(enum.Enum):
    pendiente = "pendiente"
    en_proceso = "en_proceso"
    completada = "completada"
    cancelada = "cancelada"

class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    vehiculo_id = Column(Integer, ForeignKey("vehiculos.id"))
    fecha_hora = Column(DateTime)
    estado = Column(Enum(EstadoCita))
    notas = Column(Text)

    # Relaciones
    cliente = relationship("Cliente", back_populates="citas")
    vehiculo = relationship("Vehiculo", back_populates="citas")
    servicios = relationship("CitaServicio", back_populates="cita")

class CitaServicio(Base):
    __tablename__ = "cita_servicios"

    cita_id = Column(Integer, ForeignKey("citas.id"), primary_key=True)
    servicio_id = Column(Integer, ForeignKey("servicios.id"), primary_key=True)
    precio_aplicado = Column(Numeric(10, 2))

    # Relaciones
    cita = relationship("Cita", back_populates="servicios")
    servicio = relationship("Servicio", back_populates="citas") 