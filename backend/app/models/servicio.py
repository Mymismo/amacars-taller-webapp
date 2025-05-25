from sqlalchemy import Column, String, Float, Integer, Boolean, Table, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

# Tabla de asociación para servicios y citas
cita_servicio = Table(
    'cita_servicio',
    Base.metadata,
    Column('cita_id', Integer, ForeignKey('cita.id'), primary_key=True),
    Column('servicio_id', Integer, ForeignKey('servicio.id'), primary_key=True)
)

class Servicio(Base):
    nombre = Column(String, nullable=False)
    descripcion = Column(String)
    precio_base = Column(Float, nullable=False)
    duracion_estimada = Column(Integer, nullable=False)  # en minutos
    categoria = Column(String, nullable=False)
    requiere_cita = Column(Boolean, default=True)
    disponible = Column(Boolean, default=True)

    # Relaciones
    citas = relationship("Cita", secondary=cita_servicio, back_populates="servicios")
    historial_servicios = relationship("ServicioRealizado", back_populates="servicio")

    def __repr__(self):
        return f"<Servicio {self.nombre}>" 