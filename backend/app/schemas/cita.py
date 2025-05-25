from typing import Optional, List
from datetime import datetime
from .base import BaseSchema, IDSchema, TimestampSchema
from app.models.cita import EstadoCita

class CitaBase(BaseSchema):
    usuario_id: int
    vehiculo_id: int
    fecha_hora: datetime
    estado: EstadoCita = EstadoCita.PENDIENTE
    notas_cliente: Optional[str] = None
    notas_taller: Optional[str] = None
    tecnico_asignado_id: Optional[int] = None
    presupuesto_id: Optional[int] = None

class CitaCreate(CitaBase):
    servicios_ids: List[int]

class CitaUpdate(BaseSchema):
    fecha_hora: Optional[datetime] = None
    estado: Optional[EstadoCita] = None
    notas_cliente: Optional[str] = None
    notas_taller: Optional[str] = None
    tecnico_asignado_id: Optional[int] = None
    presupuesto_id: Optional[int] = None
    servicios_ids: Optional[List[int]] = None

class Cita(CitaBase, IDSchema, TimestampSchema):
    pass

class CitaWithRelations(Cita):
    servicios_ids: List[int] = [] 