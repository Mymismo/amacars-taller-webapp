from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.servicio import cita_servicio
import enum

class EstadoCita(str, enum.Enum):
    PENDIENTE = "pendiente"
    CONFIRMADA = "confirmada"
    EN_PROCESO = "en_proceso"
    COMPLETADA = "completada"
    CANCELADA = "cancelada"

class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    fecha_hora = Column(DateTime, nullable=False)
    descripcion = Column(String(500))
    estado = Column(Enum(EstadoCita), default=EstadoCita.PENDIENTE)
    cliente_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
    vehiculo_id = Column(Integer, ForeignKey('vehiculos.id'), nullable=False)
    tecnico_id = Column(Integer, ForeignKey('usuarios.id'))
    notas = Column(String(1000))
    presupuesto_id = Column(Integer, ForeignKey("presupuestos.id"))
    
    # Relaciones
    cliente = relationship("Usuario", foreign_keys=[cliente_id], back_populates="citas_como_cliente")
    tecnico = relationship("Usuario", foreign_keys=[tecnico_id], back_populates="citas_como_tecnico")
    vehiculo = relationship("Vehiculo", back_populates="citas")
    presupuesto = relationship("Presupuesto", back_populates="cita", uselist=False)
    servicios = relationship("Servicio", secondary=cita_servicio, back_populates="citas")
    
    def __repr__(self):
        return f"<Cita {self.fecha_hora} - {self.estado}>" 