from datetime import datetime
from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class RolUsuario(str, enum.Enum):
    ADMIN = "admin"
    TECNICO = "tecnico"
    CLIENTE = "cliente"

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    nombre = Column(String(255))
    apellidos = Column(String(255))
    telefono = Column(String(20))
    direccion = Column(String(255))
    es_activo = Column(Boolean, default=True)
    es_superusuario = Column(Boolean, default=False)
    rol = Column(Enum(RolUsuario), default=RolUsuario.CLIENTE, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_actualizacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    vehiculos = relationship("Vehiculo", back_populates="propietario")
    citas_como_cliente = relationship("Cita", back_populates="cliente", foreign_keys="[Cita.cliente_id]")
    citas_como_tecnico = relationship("Cita", back_populates="tecnico", foreign_keys="[Cita.tecnico_id]")
    notificaciones = relationship("Notificacion", back_populates="usuario")

    def __repr__(self):
        return f"<Usuario {self.email}>" 