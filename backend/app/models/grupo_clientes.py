from sqlalchemy import Column, Integer, String, Table, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base

# Tabla de asociación para la relación muchos a muchos entre GrupoClientes y Usuario
grupo_cliente_usuario = Table(
    'grupo_cliente_usuario',
    Base.metadata,
    Column('grupo_id', Integer, ForeignKey('grupos_clientes.id', ondelete='CASCADE'), primary_key=True),
    Column('usuario_id', Integer, ForeignKey('usuarios.id', ondelete='CASCADE'), primary_key=True)
)

class GrupoClientes(Base):
    __tablename__ = "grupos_clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(500))
    es_activo = Column(Boolean, default=True)
    
    # Relaciones
    usuarios = relationship(
        "Usuario",
        secondary=grupo_cliente_usuario,
        primaryjoin="GrupoClientes.id == grupo_cliente_usuario.c.grupo_id",
        secondaryjoin="Usuario.id == grupo_cliente_usuario.c.usuario_id",
        lazy="joined"
    )
    
    def __repr__(self):
        return f"<GrupoClientes {self.nombre}>" 