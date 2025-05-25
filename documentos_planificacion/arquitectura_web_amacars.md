# Estructura Funcional y Roles de Usuario: Aplicación Web Amacars

## 1. Introducción

Este documento describe la arquitectura funcional propuesta, los módulos principales y los roles de usuario con sus respectivos permisos para la aplicación web de gestión del taller automotriz Amacars. El objetivo es proporcionar una base clara para el diseño detallado y el desarrollo de la aplicación, asegurando que todas las funcionalidades solicitadas por el usuario sean cubiertas de manera coherente y eficiente.

## 2. Arquitectura General de la Aplicación Web

La aplicación se desarrollará como una aplicación web moderna, utilizando un stack tecnológico que permita robustez, escalabilidad y una buena experiencia de usuario.

*   **Frontend:** Desarrollado con HTML5, CSS3 y JavaScript. Se enfoca en la interfaz de usuario (UI) y la experiencia de usuario (UX), asegurando un diseño responsivo y accesible. Se podrán utilizar frameworks o librerías de JavaScript modernas (ej. React, Vue.js, o Vanilla JS con componentes web) para dinamismo y gestión del estado en el lado del cliente, según se defina en la fase de diseño de interfaz.
*   **Backend:** Desarrollado en Python utilizando el framework Flask. Se encargará de la lógica de negocio, la gestión de la API RESTful para la comunicación con el frontend, la autenticación de usuarios, la interacción con la base de datos y el envío de notificaciones y correos electrónicos.
*   **Base de Datos:** Se utilizará una base de datos relacional, preferiblemente MySQL (compatible con la plantilla Flask sugerida), para almacenar toda la información persistente de la aplicación, incluyendo datos de usuarios, clientes, vehículos, servicios del taller, citas, historiales de servicio, registros de kilometraje y configuraciones.
*   **Servidor de Correo:** Se integrará un servicio de envío de correos electrónicos (ej. SMTP, o servicios como SendGrid, Mailgun) para las notificaciones y comunicaciones con los clientes.

## 3. Módulos Principales de la Aplicación

La aplicación se organizará en los siguientes módulos funcionales:

### 3.1. Módulo de Autenticación y Gestión de Usuarios
*   **Registro de Usuarios:** Permitirá a los nuevos clientes crear una cuenta proporcionando datos básicos (nombre, email, contraseña, teléfono).
*   **Inicio de Sesión:** Sistema seguro para que clientes y administradores accedan a la aplicación con sus credenciales.
*   **Gestión de Perfil:** Los usuarios podrán ver y editar la información de su perfil.
*   **Recuperación de Contraseña:** Funcionalidad para que los usuarios puedan restablecer su contraseña.
*   **Gestión de Usuarios Administradores (para Super-Administrador):** Un rol de administrador principal podrá crear, editar y gestionar los permisos de otros usuarios administradores del taller.

### 3.2. Módulo de Gestión de Clientes (Panel de Administración)
*   **CRUD de Clientes:** Los administradores podrán crear, leer, actualizar y eliminar perfiles de clientes.
*   **Asociación de Vehículos:** Vincular vehículos específicos a cada cliente.
*   **Historial de Cliente:** Acceso rápido al historial de servicios y comunicaciones con el cliente.

### 3.3. Módulo de Gestión de Vehículos
*   **Para Clientes:**
    *   Registrar sus vehículos (marca, modelo, año, placa, VIN, color, etc.).
    *   Ver la lista de sus vehículos registrados.
    *   Acceder al historial de servicios de cada uno de sus vehículos.
    *   Registrar el kilometraje actual de sus vehículos.
*   **Para Administradores (Panel de Administración):**
    *   Ver, editar y eliminar la información de los vehículos de los clientes.
    *   Consultar el historial de servicios y kilometraje de cualquier vehículo registrado.

### 3.4. Módulo de Gestión de Servicios del Taller (Panel de Administración)
*   **CRUD de Servicios:** Los administradores podrán definir, modificar y eliminar los servicios que ofrece el taller.
*   **Detalles del Servicio:** Para cada servicio se podrá especificar nombre, descripción detallada, tiempo estimado de duración y costo base o tarifario.

### 3.5. Módulo de Agendamiento de Citas
*   **Para Clientes:**
    *   Seleccionar vehículo y servicio deseado.
    *   Ver disponibilidad en un calendario (o solicitar franjas horarias).
    *   Solicitar una cita.
    *   Ver el estado de sus citas (solicitada, confirmada, en proceso, completada, cancelada).
    *   Cancelar citas (con antelación permitida).
*   **Para Administradores (Panel de Administración):**
    *   Visualizar todas las solicitudes de citas en un calendario o lista.
    *   Confirmar, reprogramar o cancelar citas.
    *   Asignar citas a mecánicos o bahías de trabajo (opcional).
    *   Ver la carga de trabajo del taller.

### 3.6. Módulo de Registro de Services Realizados (Historial)
*   **Para Administradores (Panel de Administración):**
    *   Al completar una cita, registrar los detalles del servicio realizado: trabajos efectuados, piezas reemplazadas (con costo opcional), observaciones del técnico, costo final del servicio, kilometraje del vehículo al momento del servicio.
    *   Actualizar el estado de la cita a "Completada".
*   **Para Clientes:**
    *   Visualizar el historial detallado de cada servicio realizado en sus vehículos, incluyendo la información registrada por el taller.

### 3.7. Módulo de Registro de Kilometraje (para Clientes)
*   **Entrada Semanal:** Los clientes tendrán una sección para ingresar de forma sencilla el kilometraje actual de cada uno de sus vehículos, idealmente una vez por semana.
*   **Historial de Kilometraje:** Visualización del historial de registros de kilometraje para cada vehículo.

### 3.8. Módulo de Notificaciones y Comunicaciones
*   **Notificaciones en la Aplicación:** Alertas visuales dentro de la plataforma para clientes y administradores sobre eventos relevantes.
*   **Notificaciones por Correo Electrónico:** Envío automático de correos para:
    *   Confirmación de registro de nuevo usuario.
    *   Confirmación de solicitud de cita.
    *   Confirmación, reprogramación o cancelación de cita por parte del taller.
    *   Recordatorios de citas próximas (ej. 24-48 horas antes).
    *   Notificación de servicio completado (con enlace a detalles/factura simplificada).
    *   Recordatorios automáticos de próximos servicios (basados en tiempo transcurrido desde el último service o por umbrales de kilometraje alcanzados).
*   **Gestión de Plantillas de Correo (Panel de Administración):** Posibilidad para los administradores de personalizar el contenido de los correos automáticos (opcional, pero recomendado).

### 3.9. Panel de Administración
*   **Dashboard:** Pantalla principal para administradores con un resumen visual de información clave: citas del día/semana, vehículos pendientes de servicio, últimas notificaciones, etc.
*   **Acceso Centralizado:** Navegación para acceder a todos los módulos de gestión: Clientes, Vehículos, Servicios del Taller, Agenda de Citas, Historial de Services, Usuarios Administradores, Configuración de Notificaciones/Recordatorios.

## 4. Roles de Usuario y Permisos

Se definirán principalmente dos roles de usuario con los siguientes permisos:

### 4.1. Cliente
*   **Autenticación:** Registrarse, iniciar sesión, cerrar sesión, gestionar su perfil (editar datos, cambiar contraseña), recuperar contraseña.
*   **Vehículos:** Añadir sus vehículos, ver la lista de sus vehículos, editar datos de sus vehículos, eliminar sus vehículos, registrar kilometraje semanalmente, ver historial de kilometraje.
*   **Citas:** Solicitar nuevas citas, ver el estado de sus citas, ver detalles de citas pasadas y futuras, cancelar citas (según políticas del taller).
*   **Historial de Servicios:** Consultar el detalle de todos los servicios realizados en sus vehículos.
*   **Notificaciones:** Recibir y ver notificaciones en la aplicación y por correo electrónico.

### 4.2. Administrador del Taller
*   **Autenticación:** Iniciar sesión, cerrar sesión, gestionar su perfil.
*   **Gestión de Clientes:** Crear, ver, editar y eliminar perfiles de clientes.
*   **Gestión de Vehículos:** Ver, editar y eliminar la información de los vehículos de todos los clientes. Consultar historiales completos.
*   **Gestión de Servicios del Taller:** Crear, editar, eliminar y consultar los servicios ofrecidos por el taller, incluyendo descripción, tiempo estimado y costo.
*   **Gestión de Agenda:** Ver todas las citas (calendario/lista), confirmar, reprogramar y cancelar citas de clientes. Registrar la finalización de un servicio y añadir detalles (trabajos, piezas, costo final, kilometraje).
*   **Gestión de Kilometraje:** Consultar los registros de kilometraje de todos los vehículos.
*   **Notificaciones y Comunicaciones:**
    *   Recibir notificaciones de nuevas solicitudes de cita o cancelaciones por parte de clientes.
    *   Configurar los parámetros para los recordatorios automáticos de servicio (intervalos de tiempo, umbrales de kilometraje).
    *   (Opcional) Enviar comunicaciones manuales a clientes (individuales o grupales).
    *   (Opcional) Gestionar plantillas de correo electrónico.
*   **Panel de Administración:** Acceso completo a todas las funcionalidades administrativas y al dashboard.
*   **(Si aplica un rol de Super-Administrador):** Gestionar las cuentas de otros usuarios administradores (crear, modificar permisos, desactivar).

## 5. Tecnologías Clave (Resumen)

*   **Backend:** Python (Flask)
*   **Frontend:** HTML, CSS, JavaScript (con posible framework/librería como React, Vue.js o similar)
*   **Base de Datos:** MySQL
*   **Servidor de Correo:** Integración SMTP o servicio de terceros.

Esta estructura funcional y la definición de roles servirán como base para el diseño de la base de datos, el desarrollo de las APIs del backend y la creación de las interfaces de usuario del frontend.
