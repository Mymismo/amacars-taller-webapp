from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

# Tabla de asociación para la relación muchos a muchos entre GrupoClientes y Usuario
grupo_cliente_usuario = Table(
    'grupo_cliente_usuario',
    Base.metadata,
    Column('grupo_id', Integer, ForeignKey('grupos_clientes.id'), primary_key=True),
    Column('usuario_id', Integer, ForeignKey('usuarios.id'), primary_key=True)
)

class GrupoClientes(Base):
    __tablename__ = "grupos_clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(500))
    
    # Relaciones
    usuarios = relationship("Usuario", secondary=grupo_cliente_usuario, backref="grupos")
    
    def __repr__(self):
        return f"<GrupoClientes {self.nombre}>" 