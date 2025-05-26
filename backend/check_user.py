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
    cursor.execute("SELECT id, email, nombre, apellidos, rol, es_activo FROM usuarios WHERE email = %s", ("juanperez@gmail.com",))
    
    # Obtener el resultado
    usuario = cursor.fetchone()
    
    if usuario:
        print("\nUsuario encontrado:")
        print(f"ID: {usuario['id']}")
        print(f"Email: {usuario['email']}")
        print(f"Nombre: {usuario['nombre']}")
        print(f"Apellidos: {usuario['apellidos']}")
        print(f"Rol: {usuario['rol']}")
        print(f"Activo: {usuario['es_activo']}")
    else:
        print("\nNo se encontró ningún usuario con el email juanperez@gmail.com")

except mysql.connector.Error as e:
    print(f"\nError al consultar la base de datos: {str(e)}")
finally:
    if 'connection' in locals() and connection.is_connected():
        cursor.close()
        connection.close() 