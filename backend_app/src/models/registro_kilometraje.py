from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database.connection import Base

class RegistroKilometraje(Base):
    __tablename__ = "registros_kilometraje"

    id = Column(Integer, primary_key=True, index=True)
    vehiculo_id = Column(Integer, ForeignKey("vehiculos.id"))
    kilometraje = Column(Integer)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    # Relación
    vehiculo = relationship("Vehiculo", back_populates="registros_kilometraje") 