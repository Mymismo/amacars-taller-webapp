from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from .base import Base

class HistorialServicio(Base):
    cita_id = Column(Integer, ForeignKey("cita.id"), nullable=False)
    vehiculo_id = Column(Integer, ForeignKey("vehiculo.id"), nullable=False)
    fecha_inicio = Column(DateTime, nullable=False)
    fecha_fin = Column(DateTime, nullable=False)
    servicios_realizados = Column(JSON, nullable=False)  # Lista de ServicioRealizado
    kilometraje = Column(Integer, nullable=False)
    tecnico_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    notas = Column(String)
    costo_total = Column(Float, nullable=False)

    # Relaciones
    cita = relationship("Cita", back_populates="historial")
    vehiculo = relationship("Vehiculo", back_populates="historial")
    tecnico = relationship("Usuario")

    def __repr__(self):
        return f"<HistorialServicio {self.fecha_inicio} - {self.vehiculo_id}>"

class ServicioRealizado(Base):
    historial_id = Column(Integer, ForeignKey("historialservicio.id"), nullable=False)
    servicio_id = Column(Integer, ForeignKey("servicio.id"), nullable=False)
    descripcion = Column(String, nullable=False)
    costo = Column(Float, nullable=False)
    piezas_utilizadas = Column(JSON)  # Lista de strings

    # Relaciones
    historial = relationship("HistorialServicio", backref="servicios")
    servicio = relationship("Servicio", back_populates="historial_servicios")

    def __repr__(self):
        return f"<ServicioRealizado {self.servicio_id} - {self.costo}>" 