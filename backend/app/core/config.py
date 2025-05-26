import os
from typing import Any, Dict, List, Optional
from pydantic import EmailStr, validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AMACARS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]
    
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
    
    # Email
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = 587
    SMTP_HOST: Optional[str] = "smtp.gmail.com"
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    EMAILS_FROM_EMAIL: Optional[EmailStr] = os.getenv("EMAILS_FROM_EMAIL", "tu_email@gmail.com")
    EMAILS_FROM_NAME: Optional[str] = os.getenv("EMAILS_FROM_NAME", "AMACARS")
    
    # Company Info
    COMPANY_NAME: str = "AMACARS"
    COMPANY_ADDRESS: str = "Calle Principal #123, Ciudad"
    COMPANY_PHONE: str = "+34 123 456 789"
    COMPANY_EMAIL: EmailStr = "info@amacars.com"
    
    # PDF
    PDF_OUTPUT_DIR: str = "pdfs"
    
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra='ignore')

settings = Settings() 