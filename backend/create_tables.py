from sqlalchemy import create_engine
from app.core.config import settings
from app.models.base import Base
from app.models.usuario import Usuario
from app.models.vehiculo import Vehiculo
from app.models.servicio import Servicio
from app.models.cita import Cita
from app.models.historial_servicio import HistorialServicio
from app.models.presupuesto import Presupuesto
from app.models.grupo_clientes import GrupoClientes
from app.models.notificacion import Notificacion

# Crear la URL de la base de datos
DATABASE_URL = f"mysql+pymysql://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}"

def init_db():
    try:
        # Crear el motor de la base de datos
        engine = create_engine(DATABASE_URL)
        
        # Crear todas las tablas
        Base.metadata.create_all(bind=engine)
        
        print("Base de datos inicializada correctamente.")
        
    except Exception as e:
        print(f"Error al inicializar la base de datos: {str(e)}")

if __name__ == "__main__":
    init_db() 