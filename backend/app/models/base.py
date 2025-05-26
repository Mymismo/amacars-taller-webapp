from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.declarative import declared_attr

class Base(DeclarativeBase):
    # Genera el nombre de la tabla automáticamente
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower() 