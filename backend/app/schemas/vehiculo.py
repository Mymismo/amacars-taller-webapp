from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from .base import BaseSchema, IDSchema, TimestampSchema

class VehiculoBase(BaseSchema):
    marca: str
    modelo: str
    anio: int
    matricula: str
    color: Optional[str] = None
    kilometraje: Optional[int] = None
    propietario_id: Optional[int] = None

class VehiculoCreate(VehiculoBase):
    pass

class VehiculoUpdate(VehiculoBase):
    pass

class Vehiculo(VehiculoBase, IDSchema, TimestampSchema):
    fecha_ultima_revision: datetime 