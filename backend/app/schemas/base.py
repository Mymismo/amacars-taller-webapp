from datetime import datetime
from pydantic import BaseModel, ConfigDict

class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class IDSchema(BaseModel):
    id: int

class TimestampSchema(BaseModel):
    fecha_creacion: datetime
    fecha_actualizacion: datetime 