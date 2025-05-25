from sqlalchemy import Column, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from .base import Base

class RolUsuario(str, enum.Enum):
    ADMIN = "admin"
    TECNICO = "tecnico"
    CLIENTE = "cliente"

class Usuario(Base):
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    telefono = Column(String)
    direccion = Column(String)
    rol = Column(Enum(RolUsuario), nullable=False, default=RolUsuario.CLIENTE)
    activo = Column(Boolean, default=True)
    grupo_id = Column(Integer, ForeignKey("grupoclientes.id"), nullable=True)

    # Relaciones
    vehiculos = relationship("Vehiculo", back_populates="usuario", cascade="all, delete-orphan")
    citas = relationship("Cita", back_populates="usuario", cascade="all, delete-orphan")
    notificaciones = relationship("Notificacion", back_populates="usuario", cascade="all, delete-orphan")
    grupo = relationship("GrupoClientes", back_populates="usuarios")

    def __repr__(self):
        return f"<Usuario {self.email}>" 