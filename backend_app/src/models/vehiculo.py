from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database.connection import Base

class Vehiculo(Base):
    __tablename__ = "vehiculos"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    marca = Column(String(50))
    modelo = Column(String(50))
    ano = Column(Integer)
    placa = Column(String(10), unique=True, index=True)
    color = Column(String(30))

    # Relaciones
    propietario = relationship("Cliente", back_populates="vehiculos")
    citas = relationship("Cita", back_populates="vehiculo", cascade="all, delete-orphan")
    registros_kilometraje = relationship("RegistroKilometraje", back_populates="vehiculo", cascade="all, delete-orphan") 