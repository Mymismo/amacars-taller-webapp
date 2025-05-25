from src.database.connection import engine, Base
from src.models import cliente, vehiculo, servicio, cita, registro_kilometraje
from sqlalchemy import text

def reset_database():
    with engine.connect() as connection:
        # Desactivar restricciones de clave foránea
        connection.execute(text("SET FOREIGN_KEY_CHECKS=0"))
        
        # Eliminar todas las tablas en orden
        tables_to_drop = [
            'registros_kilometraje',
            'cita_servicios',
            'citas',
            'vehiculos',
            'servicios',
            'clientes'
        ]
        
        for table in tables_to_drop:
            try:
                connection.execute(text(f"DROP TABLE IF EXISTS {table}"))
            except Exception as e:
                print(f"Error al eliminar la tabla {table}: {str(e)}")
        
        # Crear todas las tablas
        Base.metadata.create_all(bind=engine)
        
        # Reactivar restricciones de clave foránea
        connection.execute(text("SET FOREIGN_KEY_CHECKS=1"))
        
        # Confirmar los cambios
        connection.commit()
        
    print("Base de datos reiniciada correctamente")

if __name__ == "__main__":
    reset_database() 