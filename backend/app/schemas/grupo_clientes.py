from typing import Optional, List
from pydantic import BaseModel, condecimal
from .base import BaseSchema, IDSchema, TimestampSchema
from .usuario import Usuario

# Esquema base para GrupoClientes
class GrupoClientesBase(BaseSchema):
    nombre: str
    descripcion: Optional[str] = None
    descuento: condecimal(decimal_places=2) = 0.0
    es_activo: bool = True
    usuarios_ids: List[int] = []

# Esquema para crear GrupoClientes
class GrupoClientesCreate(GrupoClientesBase):
    pass

# Esquema para actualizar GrupoClientes
class GrupoClientesUpdate(GrupoClientesBase):
    pass

# Esquema para respuesta de GrupoClientes
class GrupoClientes(GrupoClientesBase, IDSchema, TimestampSchema):
    pass

# Esquema para GrupoClientes con relaciones
class GrupoClientesWithRelations(GrupoClientes):
    usuarios: List[Usuario] = [] 