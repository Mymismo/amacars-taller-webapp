from sqlalchemy import Column, String, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from .base import Base

class Vehiculo(Base):
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    marca = Column(String, nullable=False)
    modelo = Column(String, nullable=False)
    ano = Column(Integer, nullable=False)
    placa = Column(String, unique=True, index=True, nullable=False)
    color = Column(String)
    vin = Column(String, unique=True, index=True)
    kilometraje = Column(Integer, default=0)
    fecha_ultimo_servicio = Column(Date)
    notas = Column(String)

    # Relaciones
    usuario = relationship("Usuario", back_populates="vehiculos")
    citas = relationship("Cita", back_populates="vehiculo", cascade="all, delete-orphan")
    historial = relationship("HistorialServicio", back_populates="vehiculo", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Vehiculo {self.marca} {self.modelo} - {self.placa}>" 