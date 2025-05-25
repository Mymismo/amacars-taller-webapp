from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .base import Base

class GrupoClientes(Base):
    nombre = Column(String, nullable=False, unique=True)
    descripcion = Column(String)

    # Relaciones
    usuarios = relationship("Usuario", back_populates="grupo")
    notificaciones = relationship("Notificacion", back_populates="grupo")

    def __repr__(self):
        return f"<GrupoClientes {self.nombre}>" 