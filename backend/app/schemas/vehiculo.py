from typing import Optional
from datetime import date
from .base import BaseSchema, IDSchema, TimestampSchema

class VehiculoBase(BaseSchema):
    marca: str
    modelo: str
    ano: int
    placa: str
    color: Optional[str] = None
    vin: Optional[str] = None
    kilometraje: Optional[int] = 0
    fecha_ultimo_servicio: Optional[date] = None
    notas: Optional[str] = None
    usuario_id: int

class VehiculoCreate(VehiculoBase):
    pass

class VehiculoUpdate(BaseSchema):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: Optional[int] = None
    placa: Optional[str] = None
    color: Optional[str] = None
    vin: Optional[str] = None
    kilometraje: Optional[int] = None
    fecha_ultimo_servicio: Optional[date] = None
    notas: Optional[str] = None

class Vehiculo(VehiculoBase, IDSchema, TimestampSchema):
    pass 