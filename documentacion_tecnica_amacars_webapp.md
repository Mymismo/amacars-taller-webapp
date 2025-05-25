# Documentación Técnica: Aplicación Web Amacars

## 1. Introducción

Esta documentación técnica describe la arquitectura, componentes, modelos de datos y funcionalidades de la aplicación web Amacars, diseñada para la gestión integral de un taller automotriz. La aplicación está construida utilizando Flask para el backend, Python como lenguaje principal, y una base de datos relacional (configurable, por defecto MySQL) para la persistencia de datos.

## 2. Arquitectura General

La aplicación sigue una arquitectura de N-capas, con una clara separación entre la lógica de presentación (frontend, no desarrollado en este backend), la lógica de negocio (servicios y controladores en Flask) y la capa de acceso a datos (modelos SQLAlchemy).

-   **Backend**: API RESTful desarrollada en Flask.
-   **Base de Datos**: SQLAlchemy ORM para interactuar con una base de datos MySQL (u otra compatible).
-   **Autenticación**: Basada en sesiones y hashing de contraseñas.
-   **Notificaciones**: Integración con Flask-Mail para el envío de correos electrónicos.

### Estructura del Proyecto (Backend - `amacars_webapp`):

```
/amacars_webapp
|-- src/
|   |-- models/
|   |   |-- __init__.py
|   |   `-- models.py       # Definiciones de SQLAlchemy (User, Vehiculo, Cita, etc.)
|   |-- routes/
|   |   |-- __init__.py
|   |   |-- auth.py         # Rutas para autenticación y gestión de usuarios
|   |   |-- vehiculo.py     # Rutas para gestión de vehículos
|   |   |-- cita.py         # Rutas para gestión de citas
|   |   |-- kilometraje.py # Rutas para registro de kilometraje
|   |   |-- servicio_taller.py # Rutas para gestión de servicios del taller
|   |   `-- reminder.py     # Rutas para sugerencias y envío manual de recordatorios
|   |-- static/             # Archivos estáticos (si se sirve un frontend desde Flask)
|   |-- templates/          # Plantillas HTML (si se usa render_template, no es el foco principal de la API)
|   |-- __init__.py
|   |-- main.py           # Archivo principal de la aplicación Flask, configuración
|   `-- notifications.py  # Lógica para envío de correos y plantillas de email
|-- venv/                   # Entorno virtual de Python (no incluir en el ZIP final)
`-- requirements.txt        # Dependencias de Python
```

## 3. Modelos de Datos (`src/models/models.py`)

Se utilizan los siguientes modelos principales, definidos con SQLAlchemy:

-   **User**: Almacena información de usuarios (clientes y administradores).
    -   Campos clave: `id`, `nombre_completo`, `email` (único), `telefono`, `password_hash`, `rol` (`cliente` o `admin`), `fecha_registro`.
    -   Relaciones: Uno a muchos con `Vehiculo` y `Cita`.
-   **Vehiculo**: Información de los vehículos de los clientes.
    -   Campos clave: `id`, `marca`, `modelo`, `ano`, `placa` (única), `vin` (único), `color`, `propietario_id` (FK a User), `ultimo_kilometraje`, `fecha_ultimo_kilometraje`.
    -   Relaciones: Muchos a uno con `User`, uno a muchos con `Cita` y `RegistroKilometraje`.
-   **ServicioTaller**: Catálogo de servicios ofrecidos por el taller.
    -   Campos clave: `id`, `nombre` (único), `descripcion`, `tiempo_estimado_minutos`, `costo_base`.
    -   Relaciones: Uno a muchos con `Cita`.
-   **Cita**: Registros de las citas agendadas.
    -   Campos clave: `id`, `cliente_id` (FK a User), `vehiculo_id` (FK a Vehiculo), `servicio_id` (FK a ServicioTaller), `fecha_hora_cita`, `estado` (`solicitada`, `confirmada`, `cancelada`, `en_proceso`, `completada`), `notas_cliente`, `notas_taller`, `costo_final`, `kilometraje_entrada`.
    -   Relaciones: Muchos a uno con `User`, `Vehiculo`, `ServicioTaller`.
-   **RegistroKilometraje**: Historial de registros de kilometraje por vehículo.
    -   Campos clave: `id`, `vehiculo_id` (FK a Vehiculo), `kilometraje`, `fecha_registro`.
    -   Relaciones: Muchos a uno con `Vehiculo`.

## 4. Endpoints de la API (Rutas)

La API se organiza en blueprints de Flask para modularidad.

### 4.1. Autenticación (`/api/auth`)
-   `POST /register`: Registro de nuevos usuarios (clientes o administradores).
-   `POST /login`: Inicio de sesión de usuarios.
-   `POST /logout`: Cierre de sesión.
-   `GET /status`: Verifica el estado de la sesión actual.

### 4.2. Vehículos (`/api/vehiculos`)
-   `GET /mis_vehiculos`: (Cliente) Obtiene los vehículos del cliente logueado.
-   `POST /`: (Cliente/Admin) Añade un nuevo vehículo.
-   `PUT /<int:vehiculo_id>`: (Cliente/Admin) Actualiza un vehículo existente.
-   `DELETE /<int:vehiculo_id>`: (Cliente/Admin) Elimina un vehículo.
-   `GET /admin/all`: (Admin) Obtiene todos los vehículos registrados.
-   `GET /admin/cliente/<int:cliente_id>`: (Admin) Obtiene los vehículos de un cliente específico.

### 4.3. Citas (`/api/citas`)
-   `POST /solicitar`: (Cliente) Solicita una nueva cita.
-   `GET /mis_citas`: (Cliente) Obtiene el historial de citas del cliente logueado.
-   `GET /admin/all`: (Admin) Obtiene todas las citas del sistema.
-   `PUT /admin/<int:cita_id>/actualizar_estado`: (Admin) Actualiza el estado de una cita (confirmar, cancelar, completar, etc.) y puede añadir notas o costo final.

### 4.4. Kilometraje (`/api/kilometraje`)
-   `POST /registrar`: (Cliente) Registra un nuevo kilometraje para uno de sus vehículos.
-   `GET /historial/<int:vehiculo_id>`: (Cliente/Admin) Obtiene el historial de kilometraje de un vehículo.
-   `GET /admin/ultimo/<int:vehiculo_id>`: (Admin) Obtiene el último kilometraje registrado para un vehículo específico.

### 4.5. Servicios del Taller (`/api/servicios_taller`)
-   `POST /admin`: (Admin) Crea un nuevo servicio ofrecido por el taller.
-   `PUT /admin/<int:servicio_id>`: (Admin) Actualiza un servicio existente.
-   `DELETE /admin/<int:servicio_id>`: (Admin) Elimina un servicio.
-   `GET /`: (Público/Cliente/Admin) Obtiene la lista de todos los servicios del taller.
-   `GET /<int:servicio_id>`: (Público/Cliente/Admin) Obtiene detalles de un servicio específico.

### 4.6. Recordatorios (`/api/reminders`)
-   `GET /admin/sugerencias_servicio`: (Admin) Obtiene una lista de vehículos que, según ciertos criterios (tiempo desde último servicio, kilometraje), podrían necesitar un recordatorio.
-   `POST /admin/enviar_recordatorio/<int:vehiculo_id>`: (Admin) Envía manualmente un correo de recordatorio de servicio al propietario del vehículo especificado.

## 5. Sistema de Notificaciones (`src/notifications.py`)

Se utiliza Flask-Mail para el envío de correos electrónicos. La configuración del servidor de correo se realiza en `src/main.py` y debe ser ajustada con credenciales reales (preferiblemente mediante variables de entorno).

Funciones principales:
-   `send_email(to, subject, template_html, **kwargs)`: Función genérica para enviar correos.
-   Plantillas HTML (ejemplos en `notifications.py`):
    -   `get_registration_confirmation_email_html()`
    -   `get_appointment_confirmation_email_html()`
    -   `get_appointment_status_update_email_html()`
    -   `get_service_reminder_email_html()` (usada por el módulo de recordatorios)

**Importante sobre Recordatorios Automáticos:**
La lógica actual para recordatorios de servicio (`/api/reminders/admin/sugerencias_servicio`) identifica vehículos que podrían necesitar atención. Sin embargo, el envío de estos recordatorios de forma *totalmente automática y periódica* (ej. un cron job que se ejecute diariamente) no está implementado directamente dentro de la aplicación Flask debido a las limitaciones de los entornos de ejecución simples. La funcionalidad actual permite al administrador consultar estas sugerencias y enviar los recordatorios manualmente.
Para una automatización completa, se requeriría un programador de tareas externo (como `cron` en Linux o un servicio similar en la plataforma de despliegue) que invoque un endpoint específico o un script de la aplicación periódicamente.

## 6. Seguridad

-   **Contraseñas**: Se almacenan hasheadas utilizando `werkzeug.security` (`generate_password_hash`, `check_password_hash`).
-   **Sesiones**: Flask utiliza sesiones seguras firmadas con `SECRET_KEY`.
-   **Autorización**: Se implementa un decorador `roles_required` para proteger endpoints específicos según el rol del usuario (`cliente` o `admin`).
-   **Entradas**: Se deben validar y sanitizar todas las entradas del usuario (no implementado exhaustivamente en todos los puntos, pero es una buena práctica).

## 7. Dependencias Clave (`requirements.txt`)

-   `Flask`: Framework web.
-   `Flask-SQLAlchemy`: ORM para base de datos.
-   `PyMySQL`: Conector MySQL para SQLAlchemy.
-   `SQLAlchemy`: Toolkit SQL y ORM.
-   `cryptography`: Para hashing de contraseñas (usado por Werkzeug).
-   `Flask-Mail`: Para envío de correos electrónicos.

Consulte `requirements.txt` para la lista completa y versiones.

## 8. Consideraciones Adicionales

-   **Frontend**: Esta documentación cubre el backend. Se necesitaría un frontend (React, Vue, Angular, HTML/CSS/JS simple) para interactuar con esta API.
-   **Pruebas**: Se recomienda implementar pruebas unitarias y de integración.
-   **Escalabilidad**: Para alta concurrencia, se deben considerar estrategias de escalado (múltiples instancias, balanceador de carga, optimización de base de datos).
-   **Logging**: Flask tiene un sistema de logging incorporado. Se puede expandir para un logging más detallado y centralizado en producción.

Esta documentación proporciona una visión general. Para detalles específicos de implementación, consulte el código fuente en los respectivos archivos.

