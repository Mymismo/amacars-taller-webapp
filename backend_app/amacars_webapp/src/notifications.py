from flask_mail import Message
from src.extensions import mail
from flask import current_app, render_template_string

def send_email(to, subject, html_content):
    """Función genérica para enviar correos electrónicos."""
    try:
        mail.send_message(
            subject=subject,
            recipients=[to],
            html=html_content
        )
        current_app.logger.info(f"Correo enviado exitosamente a {to} con asunto: {subject}")
        return True
    except Exception as e:
        current_app.logger.error(f"Error al enviar correo a {to} con asunto {subject}: {str(e)}")
        return False

# --- Plantillas de Correo (Ejemplos básicos, se pueden mejorar con Jinja2 y archivos HTML) ---

def get_registration_confirmation_email_html(nombre_usuario):
    return f"""
    <html>
        <body>
            <h2>¡Bienvenido a Amacars, {nombre_usuario}!</h2>
            <p>Tu cuenta ha sido creada exitosamente.</p>
            <p>Gracias por unirte a nuestra plataforma.</p>
            <p>Atentamente,<br>El equipo de Amacars</p>
        </body>
    </html>
    """

def get_appointment_confirmation_email_html(nombre_cliente, fecha_cita, servicio_nombre, vehiculo_info):
    return f"""
    <html>
        <body>
            <h2>Confirmación de Cita en Amacars</h2>
            <p>Hola {nombre_cliente},</p>
            <p>Tu cita para el servicio de <strong>{servicio_nombre}</strong> para tu vehículo <strong>{vehiculo_info}</strong> ha sido confirmada para el <strong>{fecha_cita}</strong>.</p>
            <p>Te esperamos.</p>
            <p>Atentamente,<br>El equipo de Amacars</p>
        </body>
    </html>
    """

def get_appointment_status_update_email_html(nombre_cliente, fecha_cita, servicio_nombre, vehiculo_info, nuevo_estado, notas_taller=""):
    notas_html = f"<p><strong>Notas del taller:</strong> {notas_taller}</p>" if notas_taller else ""
    return f"""
    <html>
        <body>
            <h2>Actualización de Estado de tu Cita en Amacars</h2>
            <p>Hola {nombre_cliente},</p>
            <p>El estado de tu cita para el servicio de <strong>{servicio_nombre}</strong> (vehículo: <strong>{vehiculo_info}</strong>, programada para <strong>{fecha_cita}</strong>) ha sido actualizado a: <strong>{nuevo_estado.upper()}</strong>.</p>
            {notas_html}
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Atentamente,<br>El equipo de Amacars</p>
        </body>
    </html>
    """

def get_service_reminder_email_html(user_name, vehicle_info, service_info, appointment_date):
    template = """
    <html>
    <body>
        <h2>Recordatorio de Servicio - Amacars Taller</h2>
        <p>Estimado/a {{ user_name }},</p>
        <p>Le recordamos su próxima cita de servicio:</p>
        <ul>
            <li><strong>Vehículo:</strong> {{ vehicle_info }}</li>
            <li><strong>Servicio:</strong> {{ service_info }}</li>
            <li><strong>Fecha:</strong> {{ appointment_date }}</li>
        </ul>
        <p>Por favor, llegue 10 minutos antes de su cita.</p>
        <p>Si necesita reprogramar, por favor contáctenos con anticipación.</p>
        <br>
        <p>Saludos cordiales,</p>
        <p>Equipo Amacars Taller</p>
    </body>
    </html>
    """
    return render_template_string(
        template,
        user_name=user_name,
        vehicle_info=vehicle_info,
        service_info=service_info,
        appointment_date=appointment_date
    )

# Se podrían añadir más plantillas para recordatorios, etc.

