# Backend AMACARS

Este es el backend para la aplicación de gestión del taller mecánico AMACARS.

## Requisitos

- Python 3.8+
- MySQL 8.0+
- pip (gestor de paquetes de Python)

## Configuración

1. Crear un entorno virtual:
```bash
python -m venv .venv
```

2. Activar el entorno virtual:
- Windows:
```bash
.venv\Scripts\activate
```
- Linux/Mac:
```bash
source .venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con:
```
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
MYSQL_HOST=localhost
MYSQL_DATABASE=amacars_db
```

5. Inicializar la base de datos:
```bash
python init_db.py
```

## Ejecutar el servidor

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 5000
```

## Endpoints API

### Clientes
- GET /api/clientes - Listar todos los clientes
- POST /api/clientes - Crear nuevo cliente
- GET /api/clientes/{id} - Obtener cliente específico
- PUT /api/clientes/{id} - Actualizar cliente
- DELETE /api/clientes/{id} - Eliminar cliente

### Vehículos
- GET /api/vehiculos - Listar todos los vehículos
- POST /api/vehiculos - Crear nuevo vehículo
- GET /api/vehiculos/{id} - Obtener vehículo específico
- GET /api/vehiculos/cliente/{cliente_id} - Listar vehículos por cliente
- PUT /api/vehiculos/{id} - Actualizar vehículo
- DELETE /api/vehiculos/{id} - Eliminar vehículo

### Servicios
- GET /api/servicios - Listar todos los servicios
- POST /api/servicios - Crear nuevo servicio
- GET /api/servicios/{id} - Obtener servicio específico
- PUT /api/servicios/{id} - Actualizar servicio
- DELETE /api/servicios/{id} - Eliminar servicio (soft delete)

### Citas
- GET /api/citas - Listar todas las citas
- POST /api/citas - Crear nueva cita
- GET /api/citas/{id} - Obtener cita específica
- GET /api/citas/cliente/{cliente_id} - Listar citas por cliente
- GET /api/citas/vehiculo/{vehiculo_id} - Listar citas por vehículo
- PUT /api/citas/{id}/estado - Actualizar estado de la cita
- DELETE /api/citas/{id} - Eliminar cita 