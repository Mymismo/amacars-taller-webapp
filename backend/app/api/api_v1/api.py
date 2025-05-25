from fastapi import APIRouter
from .endpoints import (
    auth,
    usuarios,
    vehiculos,
    servicios,
    citas,
    presupuestos,
    notificaciones,
    grupos,
    historial
)

api_router = APIRouter()

# Rutas de autenticación
api_router.include_router(auth.router, prefix="/auth", tags=["autenticación"])

# Rutas de usuarios
api_router.include_router(usuarios.router, prefix="/usuarios", tags=["usuarios"])

# Rutas de vehículos
api_router.include_router(vehiculos.router, prefix="/vehiculos", tags=["vehículos"])

# Rutas de servicios
api_router.include_router(servicios.router, prefix="/servicios", tags=["servicios"])

# Rutas de citas
api_router.include_router(citas.router, prefix="/citas", tags=["citas"])

# Rutas de presupuestos
api_router.include_router(presupuestos.router, prefix="/presupuestos", tags=["presupuestos"])

# Rutas de notificaciones
api_router.include_router(notificaciones.router, prefix="/notificaciones", tags=["notificaciones"])

# Rutas de grupos de clientes
api_router.include_router(grupos.router, prefix="/grupos", tags=["grupos"])

# Rutas de historial de servicios
api_router.include_router(historial.router, prefix="/historial", tags=["historial"]) 