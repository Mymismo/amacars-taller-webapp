import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def init_database():
    # Obtener variables de entorno
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "My_Root1975")
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "amacars_db")

    # Conectar a MySQL
    connection = mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD
    )
    cursor = connection.cursor()

    # Crear base de datos si no existe
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DATABASE}")
    print(f"Base de datos {MYSQL_DATABASE} creada o ya existente")

    # Cerrar conexión
    cursor.close()
    connection.close()

if __name__ == "__main__":
    init_database() 