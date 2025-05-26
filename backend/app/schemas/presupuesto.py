from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, condecimal
from .base import BaseSchema, IDSchema, TimestampSchema
from app.models.presupuesto import EstadoPresupuesto

class PresupuestoBase(BaseSchema):
    descripcion: str
    monto_total: condecimal(decimal_places=2)
    estado: EstadoPresupuesto = EstadoPresupuesto.PENDIENTE
    fecha_validez: datetime
    cita_id: int
    notas: Optional[str] = None
    descuento: condecimal(decimal_places=2) = 0.0
    servicios_ids: List[int] = []

class PresupuestoCreate(PresupuestoBase):
    pass

class PresupuestoUpdate(PresupuestoBase):
    pass

class Presupuesto(PresupuestoBase, IDSchema, TimestampSchema):
    pass 