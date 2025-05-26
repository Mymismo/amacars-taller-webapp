from typing import Optional, List
from pydantic import BaseModel, condecimal
from .base import BaseSchema, IDSchema, TimestampSchema

class ServicioBase(BaseSchema):
    nombre: str
    descripcion: Optional[str] = None
    precio_base: condecimal(decimal_places=2) = 0.0
    duracion_estimada: Optional[int] = None
    es_activo: bool = True
    categoria: str
    requiere_cita: bool = True
    disponible: bool = True

class ServicioCreate(ServicioBase):
    pass

class ServicioUpdate(ServicioBase):
    pass

class Servicio(ServicioBase, IDSchema, TimestampSchema):
    pass

class ServicioWithRelations(Servicio):
    citas_ids: List[int] = [] 