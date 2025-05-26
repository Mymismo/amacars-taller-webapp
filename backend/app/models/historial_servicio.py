from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from .base import Base

class HistorialServicio(Base):
    __tablename__ = "historial_servicios"

    id = Column(Integer, primary_key=True, index=True)
    cita_id = Column(Integer, ForeignKey("citas.id"), nullable=False)
    vehiculo_id = Column(Integer, ForeignKey("vehiculos.id"), nullable=False)
    fecha_inicio = Column(DateTime, nullable=False)
    fecha_fin = Column(DateTime, nullable=False)
    servicios_realizados = Column(JSON, nullable=False)  # Lista de ServicioRealizado
    kilometraje = Column(Integer, nullable=False)
    tecnico_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    notas = Column(String(1000))
    costo_total = Column(Float, nullable=False)

    # Relaciones
    cita = relationship("Cita", back_populates="historial")
    vehiculo = relationship("Vehiculo", back_populates="historial")
    tecnico = relationship("Usuario")
    servicios = relationship("ServicioRealizado", back_populates="historial")

    def __repr__(self):
        return f"<HistorialServicio {self.fecha_inicio} - {self.vehiculo_id}>"

class ServicioRealizado(Base):
    __tablename__ = "servicios_realizados"

    id = Column(Integer, primary_key=True, index=True)
    historial_id = Column(Integer, ForeignKey("historial_servicios.id"), nullable=False)
    servicio_id = Column(Integer, ForeignKey("servicios.id"), nullable=False)
    descripcion = Column(String(500), nullable=False)
    costo = Column(Float, nullable=False)
    piezas_utilizadas = Column(JSON)  # Lista de strings

    # Relaciones
    historial = relationship("HistorialServicio", back_populates="servicios")
    servicio = relationship("Servicio", back_populates="historial_servicios")

    def __repr__(self):
        return f"<ServicioRealizado {self.servicio_id} - {self.costo}>" 