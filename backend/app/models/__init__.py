from .base import Base
from .usuario import Usuario, RolUsuario
from .vehiculo import Vehiculo
from .servicio import Servicio, cita_servicio
from .cita import Cita, EstadoCita
from .presupuesto import Presupuesto, EstadoPresupuesto
from .notificacion import Notificacion, TipoNotificacion, EstadoNotificacion
from .grupo_clientes import GrupoClientes, grupo_cliente_usuario

# Asegurarse de que todas las relaciones estén configuradas
__all__ = [
    'Base',
    'Usuario',
    'RolUsuario',
    'Vehiculo',
    'Servicio',
    'cita_servicio',
    'Cita',
    'EstadoCita',
    'Presupuesto',
    'EstadoPresupuesto',
    'Notificacion',
    'TipoNotificacion',
    'EstadoNotificacion',
    'GrupoClientes',
    'grupo_cliente_usuario'
]

# Configurar todas las relaciones
Base.metadata.create_all = lambda *args, **kwargs: None 