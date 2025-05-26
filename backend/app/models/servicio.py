from sqlalchemy import Column, Integer, String, Float, Boolean, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

# Tabla de asociación para la relación muchos a muchos entre Cita y Servicio
cita_servicio = Table(
    'cita_servicio',
    Base.metadata,
    Column('cita_id', Integer, ForeignKey('citas.id'), primary_key=True),
    Column('servicio_id', Integer, ForeignKey('servicios.id'), primary_key=True)
)

class Servicio(Base):
    __tablename__ = "servicios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(500))
    precio_base = Column(Float, default=0.0)
    duracion_estimada = Column(Integer)  # en minutos
    es_activo = Column(Boolean, default=True)
    categoria = Column(String(100), nullable=False)
    requiere_cita = Column(Boolean, default=True)
    disponible = Column(Boolean, default=True)

    # Relaciones
    citas = relationship("Cita", secondary=cita_servicio, back_populates="servicios")

    def __repr__(self):
        return f"<Servicio {self.nombre}>" 