from sqlalchemy.orm import DeclarativeBase, declared_attr
from sqlalchemy.ext.declarative import declarative_base

class Base(DeclarativeBase):
    # Genera el nombre de la tabla automáticamente
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    # Configuración para evitar problemas con relaciones circulares
    __table_args__ = {'extend_existing': True} 