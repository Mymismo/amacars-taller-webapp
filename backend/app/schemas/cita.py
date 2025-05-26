from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from .base import BaseSchema, IDSchema, TimestampSchema
from app.models.cita import EstadoCita

class CitaBase(BaseSchema):
    fecha_hora: datetime
    descripcion: Optional[str] = None
    estado: EstadoCita = EstadoCita.PENDIENTE
    cliente_id: int
    vehiculo_id: int
    tecnico_id: Optional[int] = None
    notas: Optional[str] = None
    presupuesto_id: Optional[int] = None
    servicios_ids: List[int] = []

class CitaCreate(CitaBase):
    pass

class CitaUpdate(CitaBase):
    pass

class Cita(CitaBase, IDSchema, TimestampSchema):
    pass

class CitaWithRelations(Cita):
    servicios_ids: List[int] = [] 