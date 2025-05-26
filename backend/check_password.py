import mysql.connector
from app.core.config import settings

try:
    # Conectar a la base de datos
    connection = mysql.connector.connect(
        host=settings.MYSQL_HOST,
        user=settings.MYSQL_USER,
        password=settings.MYSQL_PASSWORD,
        database=settings.MYSQL_DB
    )
    
    cursor = connection.cursor(dictionary=True)
    
    # Ejecutar la consulta
    cursor.execute("SELECT id, email, hashed_password FROM usuarios WHERE email = %s", ("juanperez@gmail.com",))
    
    # Obtener el resultado
    usuario = cursor.fetchone()
    
    if usuario:
        print("\nInformación de la contraseña del usuario:")
        print(f"ID: {usuario['id']}")
        print(f"Email: {usuario['email']}")
        print(f"Contraseña hasheada: {usuario['hashed_password']}")
    else:
        print("\nNo se encontró ningún usuario con el email juanperez@gmail.com")

except mysql.connector.Error as e:
    print(f"\nError al consultar la base de datos: {str(e)}")
finally:
    if 'connection' in locals() and connection.is_connected():
        cursor.close()
        connection.close() 