from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database.connection import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    apellidos = Column(String(100))
    telefono = Column(String(15))
    email = Column(String(100), unique=True, index=True)
    direccion = Column(Text)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    vehiculos = relationship("Vehiculo", back_populates="propietario", cascade="all, delete-orphan")
    citas = relationship("Cita", back_populates="cliente", cascade="all, delete-orphan") 