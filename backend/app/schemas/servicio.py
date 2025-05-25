from typing import Optional, List
from .base import BaseSchema, IDSchema, TimestampSchema

class ServicioBase(BaseSchema):
    nombre: str
    descripcion: Optional[str] = None
    precio_base: float
    duracion_estimada: int
    categoria: str
    requiere_cita: bool = True
    disponible: bool = True

class ServicioCreate(ServicioBase):
    pass

class ServicioUpdate(BaseSchema):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = None
    duracion_estimada: Optional[int] = None
    categoria: Optional[str] = None
    requiere_cita: Optional[bool] = None
    disponible: Optional[bool] = None

class Servicio(ServicioBase, IDSchema, TimestampSchema):
    pass

class ServicioWithRelations(Servicio):
    citas_ids: List[int] = [] 