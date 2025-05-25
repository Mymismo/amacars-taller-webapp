from typing import Optional, List, Dict, Any
from datetime import datetime
from .base import BaseSchema, IDSchema, TimestampSchema

class ServicioRealizadoBase(BaseSchema):
    historial_id: int
    servicio_id: int
    descripcion: str
    costo: float
    piezas_utilizadas: Optional[List[str]] = None

class ServicioRealizadoCreate(ServicioRealizadoBase):
    pass

class ServicioRealizadoUpdate(BaseSchema):
    descripcion: Optional[str] = None
    costo: Optional[float] = None
    piezas_utilizadas: Optional[List[str]] = None

class ServicioRealizado(ServicioRealizadoBase, IDSchema, TimestampSchema):
    pass

class HistorialServicioBase(BaseSchema):
    cita_id: int
    vehiculo_id: int
    fecha_inicio: datetime
    fecha_fin: datetime
    servicios_realizados: List[Dict[str, Any]]
    kilometraje: int
    tecnico_id: int
    notas: Optional[str] = None
    costo_total: float

class HistorialServicioCreate(HistorialServicioBase):
    pass

class HistorialServicioUpdate(BaseSchema):
    fecha_fin: Optional[datetime] = None
    servicios_realizados: Optional[List[Dict[str, Any]]] = None
    kilometraje: Optional[int] = None
    notas: Optional[str] = None
    costo_total: Optional[float] = None

class HistorialServicio(HistorialServicioBase, IDSchema, TimestampSchema):
    pass 