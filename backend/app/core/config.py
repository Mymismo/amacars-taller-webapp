from typing import Optional
from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    PROJECT_NAME: str = "AMACARS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database settings
    MYSQL_HOST: str = "localhost"
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "My_Root1975"
    MYSQL_DB: str = "amacars_db"
    MYSQL_PORT: int = 3306
    
    # JWT settings
    SECRET_KEY: str = "tu_clave_secreta_super_segura_cambiar_en_produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # First admin user
    FIRST_SUPERUSER: str = "admin@amacars.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    # Email settings
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_USER: str = "talleramacars@gmail.com"
    SMTP_PASSWORD: str = "yaih ngae ybqh vuxg"
    EMAILS_FROM_EMAIL: str = "talleramacars@gmail.com"
    EMAILS_FROM_NAME: str = "AMACARS Taller Mecánico"

    # PDF settings
    PDF_OUTPUT_DIR: str = str(Path("pdfs"))
    COMPANY_NAME: str = "AMACARS Taller Mecánico"
    COMPANY_ADDRESS: str = "Calle Principal #123, Ciudad"
    COMPANY_PHONE: str = "+34 123 456 789"
    COMPANY_EMAIL: str = "talleramacars@gmail.com"

    class Config:
        case_sensitive = True

settings = Settings() 