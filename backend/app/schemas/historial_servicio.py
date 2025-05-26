from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, condecimal
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
    vehiculo_id: int
    servicio_id: int
    fecha_servicio: datetime
    kilometraje: Optional[int] = None
    costo: condecimal(decimal_places=2)
    descripcion: str
    notas: Optional[str] = None
    tecnico_id: Optional[int] = None
    cita_id: Optional[int] = None

class HistorialServicioCreate(HistorialServicioBase):
    pass

class HistorialServicioUpdate(HistorialServicioBase):
    pass

class HistorialServicio(HistorialServicioBase, IDSchema, TimestampSchema):
    pass 