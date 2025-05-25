import os
from typing import Any, Dict, List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, select_autoescape, PackageLoader
from pydantic import EmailStr
from app.core.config import settings

# Configuración de FastMail
conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER,
    MAIL_PASSWORD=settings.SMTP_PASSWORD,
    MAIL_FROM=settings.EMAILS_FROM_EMAIL,
    MAIL_PORT=settings.SMTP_PORT,
    MAIL_SERVER=settings.SMTP_HOST,
    MAIL_FROM_NAME=settings.EMAILS_FROM_NAME,
    MAIL_SSL_TLS=settings.SMTP_TLS,
    USE_CREDENTIALS=True
)

# Configuración de Jinja2 para templates
env = Environment(
    loader=PackageLoader('app', 'templates/email'),
    autoescape=select_autoescape(['html', 'xml'])
)

class EmailService:
    def __init__(self):
        self.fastmail = FastMail(conf)
    
    async def send_email(
        self,
        email_to: str,
        subject: str,
        template_name: str,
        template_data: Dict[str, Any]
    ) -> None:
        """
        Enviar email usando un template.
        """
        template = env.get_template(f"{template_name}.html")
        html = template.render(**template_data)
        
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=html,
            subtype="html"
        )
        
        await self.fastmail.send_message(message)
    
    async def send_cita_confirmacion(
        self,
        email_to: EmailStr,
        nombre: str,
        fecha: str,
        servicios: List[str]
    ) -> None:
        """
        Enviar email de confirmación de cita.
        """
        await self.send_email(
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
    ) -> None:
        """
        Enviar email con presupuesto adjunto.
        """
        template_data = {
            "nombre": nombre,
            "presupuesto_id": presupuesto_id,
            "total": total
        }
        
        message = MessageSchema(
            subject=f"Presupuesto #{presupuesto_id} - AMACARS",
            recipients=[email_to],
            template_body=template_data,
            attachments=[pdf_path]
        )
        
        await self.fastmail.send_message(message)
    
    async def send_notificacion_servicio_completado(
        self,
        email_to: EmailStr,
        nombre: str,
        vehiculo: str,
        servicios: List[str],
        pdf_path: str = None
    ) -> None:
        """
        Enviar notificación de servicio completado.
        """
        template_data = {
            "nombre": nombre,
            "vehiculo": vehiculo,
            "servicios": servicios
        }
        
        message = MessageSchema(
            subject="Servicio Completado - AMACARS",
            recipients=[email_to],
            template_body=template_data,
            attachments=[pdf_path] if pdf_path else None
        )
        
        await self.fastmail.send_message(message)
    
    async def send_recordatorio_cita(
        self,
        email_to: EmailStr,
        nombre: str,
        fecha: str,
        servicios: List[str]
    ) -> None:
        """
        Enviar recordatorio de cita.
        """
        await self.send_email(
            email_to=email_to,
            subject="Recordatorio de Cita - AMACARS",
            template_name="recordatorio_cita",
            template_data={
                "nombre": nombre,
                "fecha": fecha,
                "servicios": servicios
            }
        )

email_service = EmailService() 