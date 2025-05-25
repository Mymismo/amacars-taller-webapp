from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
import enum
from .base import Base
from .servicio import cita_servicio

class EstadoCita(str, enum.Enum):
    PENDIENTE = "pendiente"
    CONFIRMADA = "confirmada"
    EN_PROCESO = "en_proceso"
    COMPLETADA = "completada"
    CANCELADA = "cancelada"

class Cita(Base):
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    vehiculo_id = Column(Integer, ForeignKey("vehiculo.id"), nullable=False)
    fecha_hora = Column(DateTime, nullable=False)
    estado = Column(Enum(EstadoCita), nullable=False, default=EstadoCita.PENDIENTE)
    notas_cliente = Column(String)
    notas_taller = Column(String)
    tecnico_asignado_id = Column(Integer, ForeignKey("usuario.id"))
    presupuesto_id = Column(Integer, ForeignKey("presupuesto.id"))

    # Relaciones
    usuario = relationship("Usuario", back_populates="citas", foreign_keys=[usuario_id])
    vehiculo = relationship("Vehiculo", back_populates="citas")
    servicios = relationship("Servicio", secondary=cita_servicio, back_populates="citas")
    tecnico = relationship("Usuario", foreign_keys=[tecnico_asignado_id])
    presupuesto = relationship("Presupuesto", back_populates="cita", uselist=False)
    historial = relationship("HistorialServicio", back_populates="cita", uselist=False)

    def __repr__(self):
        return f"<Cita {self.fecha_hora} - {self.estado}>" 