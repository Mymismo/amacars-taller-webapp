from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import Base
from datetime import datetime

class Vehiculo(Base):
    __tablename__ = "vehiculos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String(100), nullable=False)
    modelo = Column(String(100), nullable=False)
    anio = Column(Integer, nullable=False)
    matricula = Column(String(20), unique=True, nullable=False)
    color = Column(String(50))
    kilometraje = Column(Integer)
    fecha_ultima_revision = Column(DateTime, default=datetime.utcnow)
    propietario_id = Column(Integer, ForeignKey('usuarios.id'))
    
    # Relaciones
    propietario = relationship("Usuario", back_populates="vehiculos")
    citas = relationship("Cita", back_populates="vehiculo")
    
    def __repr__(self):
        return f"<Vehiculo {self.marca} {self.modelo} - {self.matricula}>" 