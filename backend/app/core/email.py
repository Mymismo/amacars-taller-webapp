import os
from typing import Any, Dict, List, Optional
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, select_autoescape, PackageLoader
from pydantic import EmailStr
from app.core.config import settings
from pathlib import Path

# Configuración del servicio de correo
conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER if hasattr(settings, 'SMTP_USER') else None,
    MAIL_PASSWORD=settings.SMTP_PASSWORD if hasattr(settings, 'SMTP_PASSWORD') else None,
    MAIL_FROM=settings.EMAILS_FROM_EMAIL if hasattr(settings, 'EMAILS_FROM_EMAIL') else None,
    MAIL_FROM_NAME=settings.EMAILS_FROM_NAME if hasattr(settings, 'EMAILS_FROM_NAME') else None,
    MAIL_PORT=settings.SMTP_PORT if hasattr(settings, 'SMTP_PORT') else 587,
    MAIL_SERVER=settings.SMTP_HOST if hasattr(settings, 'SMTP_HOST') else "smtp.gmail.com",
    MAIL_SSL_TLS=settings.SMTP_TLS if hasattr(settings, 'SMTP_TLS') else True,
    MAIL_STARTTLS=True,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=Path(__file__).parent.parent / 'templates'
)

# Configuración de Jinja2 para templates
env = Environment(
    loader=PackageLoader('app', 'templates/email'),
    autoescape=select_autoescape(['html', 'xml'])
)

# Inicializar el servicio de correo solo si todas las credenciales están presentes
email_service = None
try:
    if all([
        conf.MAIL_USERNAME,
        conf.MAIL_PASSWORD,
        conf.MAIL_FROM
    ]):
        email_service = FastMail(conf)
except Exception as e:
    print(f"Error al inicializar el servicio de correo: {str(e)}")

class EmailService:
    def __init__(self):
        self.fastmail = email_service
    
    async def send_email(
        self,
        email_to: str,
        subject: str,
        template_name: str,
        template_data: Dict[str, Any]
    ) -> bool:
        """
        Enviar email usando un template.
        """
        if not self.fastmail:
            print("Servicio de correo no configurado")
            return False
        
        try:
            template = env.get_template(f"{template_name}.html")
            html = template.render(**template_data)
            
            message = MessageSchema(
                subject=subject,
                recipients=[email_to],
                body=html,
                subtype="html"
            )
            
            await self.fastmail.send_message(message)
            return True
        except Exception as e:
            print(f"Error enviando correo: {str(e)}")
            return False
    
    async def send_cita_confirmacion(
        self,
        email_to: EmailStr,
        nombre: str,
        fecha: str,
        servicios: List[str]
    ) -> bool:
        """
        Enviar email de confirmación de cita.
        """
        return await self.send_email(
            email_to=email_to,
            subject="Confirmación de Cita - AMACARS",
            template_name="cita_confirmacion",
            template_data={
                "nombre": nombre,
                "fecha": fecha,
                "servicios": servicios
            }
        )
    
    async def send_presupuesto(
        self,
        email_to: EmailStr,
        nombre: str,
        presupuesto_id: int,
        total: float,
        pdf_path: str
    ) -> bool:
        """
        Enviar email con presupuesto adjunto.
        """
        template_data = {
            "nombre": nombre,
            "presupuesto_id": presupuesto_id,
            "total": total
        }
        
        return await self.send_email(
            email_to=email_to,
            subject=f"Presupuesto #{presupuesto_id} - AMACARS",
            template_name="presupuesto",
            template_data=template_data
        )
    
    async def send_notificacion_servicio_completado(
        self,
        email_to: EmailStr,
        nombre: str,
        vehiculo: str,
        servicios: List[str],
        pdf_path: str = None
    ) -> bool:
        """
        Enviar notificación de servicio completado.
        """
        template_data = {
            "nombre": nombre,
            "vehiculo": vehiculo,
            "servicios": servicios
        }
        
        return await self.send_email(
            email_to=email_to,
            subject="Servicio Completado - AMACARS",
            template_name="servicio_completado",
            template_data=template_data
        )
    
    async def send_recordatorio_cita(
        self,
        email_to: EmailStr,
        nombre: str,
        fecha: str,
        servicios: List[str]
    ) -> bool:
        """
        Enviar recordatorio de cita.
        """
        return await self.send_email(
            email_to=email_to,
            subject="Recordatorio de Cita - AMACARS",
            template_name="recordatorio_cita",
            template_data={
                "nombre": nombre,
                "fecha": fecha,
                "servicios": servicios
            }
        )

email_service_instance = EmailService() 