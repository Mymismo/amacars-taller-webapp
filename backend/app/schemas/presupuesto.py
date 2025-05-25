from typing import Optional, List, Dict, Any
from datetime import datetime
from .base import BaseSchema, IDSchema, TimestampSchema
from app.models.presupuesto import EstadoPresupuesto

class PresupuestoItemBase(BaseSchema):
    servicio_id: int
    cantidad: int
    precio_unitario: float
    descripcion: Optional[str] = None

class PresupuestoBase(BaseSchema):
    usuario_id: int
    vehiculo_id: int
    fecha_emision: datetime
    fecha_validez: datetime
    items: List[Dict[str, Any]]
    subtotal: float
    impuestos: float
    total: float
    estado: EstadoPresupuesto = EstadoPresupuesto.PENDIENTE
    notas: Optional[str] = None

class PresupuestoCreate(PresupuestoBase):
    pass

class PresupuestoUpdate(BaseSchema):
    fecha_validez: Optional[datetime] = None
    items: Optional[List[Dict[str, Any]]] = None
    subtotal: Optional[float] = None
    impuestos: Optional[float] = None
    total: Optional[float] = None
    estado: Optional[EstadoPresupuesto] = None
    notas: Optional[str] = None

class Presupuesto(PresupuestoBase, IDSchema, TimestampSchema):
    pass 