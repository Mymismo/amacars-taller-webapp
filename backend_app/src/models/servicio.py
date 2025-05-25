from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean
from sqlalchemy.orm import relationship
from ..database.connection import Base

class Servicio(Base):
    __tablename__ = "servicios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    descripcion = Column(Text)
    precio = Column(Numeric(10, 2))
    duracion_estimada = Column(Integer)  # en minutos
    estado = Column(Boolean, default=True)

    # Relaciones
    citas = relationship("CitaServicio", back_populates="servicio") 