# Guía de Despliegue: Aplicación Web Amacars

## 1. Requisitos Previos

Antes de desplegar la aplicación web Amacars, asegúrate de tener lo siguiente:

-   **Servidor o Plataforma de Hosting**: Un lugar donde ejecutar la aplicación Flask (ej. un VPS, PaaS como Heroku, Google App Engine, AWS Elastic Beanstalk, etc.).
-   **Python**: Versión 3.8 o superior instalada en el servidor.
-   **pip**: El gestor de paquetes de Python.
-   **Base de Datos MySQL**: Una instancia de MySQL accesible desde el servidor de la aplicación. Puede ser local o un servicio de base de datos en la nube.
-   **Servidor SMTP**: Credenciales y configuración de un servidor SMTP para el envío de correos electrónicos (ej. Gmail, SendGrid, Mailgun, o tu propio servidor de correo).
-   **Git (Recomendado)**: Para clonar el repositorio y gestionar actualizaciones.

## 2. Configuración del Entorno

### 2.1. Clonar el Repositorio (si aplica)

Si el código está en un repositorio Git:
```bash
git clone <URL_DEL_REPOSITORIO>
cd amacars_webapp
```
Si recibiste un archivo ZIP, descomprímelo en el directorio deseado en el servidor.

### 2.2. Crear y Activar un Entorno Virtual

Es altamente recomendable usar un entorno virtual para aislar las dependencias del proyecto.

```bash
python3 -m venv venv
source venv/bin/activate  # En Linux/macOS
# venv\Scripts\activate    # En Windows
```

### 2.3. Instalar Dependencias

Con el entorno virtual activado, instala las dependencias listadas en `requirements.txt`:

```bash
pip install -r requirements.txt
```

### 2.4. Configurar Variables de Entorno

La aplicación utiliza variables de entorno para configuraciones sensibles y específicas del entorno. Estas deben ser configuradas en tu servidor. La forma de hacerlo varía según la plataforma de hosting.

Variables requeridas/recomendadas:

-   **Para la Base de Datos MySQL**:
    -   `DB_USERNAME`: Usuario de la base de datos (por defecto: `root`).
    -   `DB_PASSWORD`: Contraseña del usuario de la base de datos (por defecto: `password`).
    -   `DB_HOST`: Host de la base de datos (por defecto: `localhost`).
    -   `DB_PORT`: Puerto de la base de datos (por defecto: `3306`).
    -   `DB_NAME`: Nombre de la base de datos para la aplicación (por defecto: `amacars_db`). **Debes crear esta base de datos en tu servidor MySQL.**

-   **Para Flask**:
    -   `FLASK_SECRET_KEY`: Una clave secreta larga y aleatoria para la seguridad de las sesiones de Flask. Puedes generar una con `python -c 'import secrets; print(secrets.token_hex(32))'`.
    -   `FLASK_ENV`: Configurar a `production` para el entorno de producción. (En `main.py` el debug está en True si `__name__ == '__main__'`, lo cual es para desarrollo. Para producción se usa un servidor WSGI).

-   **Para el Envío de Correos (Flask-Mail)**:
    -   `MAIL_SERVER`: Dirección del servidor SMTP (ej. `smtp.gmail.com`).
    -   `MAIL_PORT`: Puerto del servidor SMTP (ej. `587` para TLS, `465` para SSL).
    -   `MAIL_USE_TLS`: `true` o `false`.
    -   `MAIL_USE_SSL`: `true` o `false`.
    -   `MAIL_USERNAME`: Tu dirección de correo electrónico para enviar emails.
    -   `MAIL_PASSWORD`: La contraseña de tu correo o una contraseña de aplicación específica (recomendado para Gmail).
    -   `MAIL_DEFAULT_SENDER`: El nombre y la dirección de correo que aparecerán como remitente (ej. `"Amacars Taller <tu_email@example.com>"`).

**Ejemplo de configuración (archivo `.env` si usas `python-dotenv`, aunque no está configurado por defecto para leerlo, o directamente en el entorno del servidor):**
```
DB_USERNAME="tu_usuario_db"
DB_PASSWORD="tu_contraseña_db"
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="amacars_db"
FLASK_SECRET_KEY="tu_super_secreta_y_larga_llave_flask"
FLASK_ENV="production"
MAIL_SERVER="smtp.gmail.com"
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USE_SSL=false
MAIL_USERNAME="tu_correo@gmail.com"
MAIL_PASSWORD="tu_contraseña_de_aplicacion_gmail"
MAIL_DEFAULT_SENDER="Amacars Taller <tu_correo@gmail.com>"
```

## 3. Preparar la Base de Datos

1.  **Crear la Base de Datos**: Conéctate a tu servidor MySQL y crea la base de datos especificada en `DB_NAME` (ej. `amacars_db`):
    ```sql
    CREATE DATABASE amacars_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```
2.  **Crear las Tablas**: La aplicación Flask creará automáticamente las tablas necesarias la primera vez que se inicie, gracias a `db.create_all()` en `src/main.py` dentro del contexto de la aplicación. Asegúrate de que el usuario de la base de datos (`DB_USERNAME`) tenga los permisos necesarios para crear tablas y manipular datos en `DB_NAME`.

## 4. Ejecutar la Aplicación en Producción

No se recomienda usar el servidor de desarrollo de Flask (`app.run()`) en un entorno de producción. En su lugar, utiliza un servidor WSGI como Gunicorn o uWSGI.

### 4.1. Usando Gunicorn (Ejemplo)

1.  **Instalar Gunicorn** (si no está ya en `requirements.txt`):
    ```bash
    pip install gunicorn
    ```
2.  **Ejecutar la aplicación con Gunicorn**:
    Desde el directorio raíz del proyecto (`amacars_webapp`), donde se encuentra el directorio `src`:
    ```bash
    gunicorn --workers 4 --bind 0.0.0.0:5000 "src.main:app"
    ```
    -   `--workers 4`: Número de procesos trabajadores (ajusta según los núcleos de tu CPU).
    -   `--bind 0.0.0.0:5000`: Escucha en todas las interfaces en el puerto 5000. Puedes cambiar el puerto.
    -   `"src.main:app"`: Indica a Gunicorn dónde encontrar la instancia de la aplicación Flask (`app`) dentro del módulo `src.main`.

### 4.2. Configurar un Proxy Inverso (Recomendado)

Para producción, es común usar un servidor web como Nginx o Apache como proxy inverso delante de Gunicorn. Esto puede manejar conexiones HTTPS, servir archivos estáticos de manera eficiente, y proporcionar balanceo de carga.

**Ejemplo de configuración básica de Nginx:**

```nginx
server {
    listen 80;
    server_name tu_dominio.com www.tu_dominio.com;

    location / {
        proxy_pass http://127.0.0.1:5000; # Asumiendo que Gunicorn corre en el puerto 5000 localmente
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Si tienes archivos estáticos que Nginx debe servir directamente (opcional si Flask los maneja)
    # location /static {
    #     alias /ruta/a/tu/proyecto/amacars_webapp/src/static;
    # }
}
```
No olvides configurar HTTPS con SSL/TLS (ej. usando Let's Encrypt con Certbot).

## 5. Primeros Pasos Después del Despliegue

1.  **Acceder a la Aplicación**: Abre tu navegador y ve a la URL donde desplegaste la aplicación (ej. `http://tu_dominio.com`).
2.  **Crear Usuario Administrador**: El primer usuario que se registre puede ser un cliente. Para crear un administrador, puedes:
    -   Registrar un usuario normalmente a través de la API (`/api/auth/register`) con el rol `admin` en el payload JSON.
    -   O, si necesitas hacerlo manualmente en la base de datos, conéctate a tu base de datos MySQL y ejecuta una inserción SQL o modifica un usuario existente para asignarle el rol `admin`.
        ```sql
        -- Ejemplo para actualizar un usuario existente a admin:
        -- UPDATE users SET rol = 'admin' WHERE email = 'tu_email_admin@example.com';
        ```
3.  **Configurar Servicios del Taller**: Como administrador, utiliza los endpoints de `/api/servicios_taller/admin` para añadir los servicios que ofrece el taller.

## 6. Mantenimiento y Actualizaciones

-   **Logs**: Revisa regularmente los logs de la aplicación (Gunicorn, Nginx) y los logs de Flask (si están configurados para escribir a archivo) para monitorear errores.
-   **Actualizaciones de Código**: Para actualizar la aplicación, haz `git pull` (si usas Git), reinstala dependencias si `requirements.txt` cambió, y reinicia el servidor WSGI (Gunicorn).
-   **Copias de Seguridad**: Realiza copias de seguridad periódicas de tu base de datos.

## 7. Solución de Problemas Comunes

-   **Errores 500 Internal Server Error**: Revisa los logs de Gunicorn/Flask para ver el traceback detallado del error.
-   **Problemas de Conexión a la Base de Datos**: Verifica que las variables de entorno `DB_*` sean correctas, que el servidor MySQL esté corriendo y accesible, y que el usuario de la base de datos tenga los permisos correctos.
-   **Correos No Enviados**: Revisa la configuración `MAIL_*` y los logs. Asegúrate de que tu servidor de correo permita la conexión desde la IP de tu servidor de aplicación. Para Gmail, es posible que necesites habilitar "Acceso de aplicaciones menos seguras" o usar una "Contraseña de aplicación".
-   **Permisos de Archivos**: Asegúrate de que el usuario que ejecuta Gunicorn tenga permisos de lectura/escritura necesarios si la aplicación necesita acceder al sistema de archivos (no es el caso principal para esta API, pero podría serlo para logs o uploads futuros).

Esta guía proporciona los pasos esenciales. La configuración exacta puede variar dependiendo de tu entorno de hosting específico.

