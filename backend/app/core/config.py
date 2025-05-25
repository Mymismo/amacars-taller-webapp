import os
from typing import Any, Dict, List, Optional, Union
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AMACARS API"
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "tu_clave_secreta_super_segura_cambiame_en_produccion")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 días
    
    # Base de datos
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "amacars_db")
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )
    
    # Email
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = 587
    SMTP_HOST: Optional[str] = "smtp.gmail.com"
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    EMAILS_FROM_EMAIL: Optional[EmailStr] = os.getenv("EMAILS_FROM_EMAIL", "tu_email@gmail.com")
    EMAILS_FROM_NAME: Optional[str] = os.getenv("EMAILS_FROM_NAME", "AMACARS")
    
    # Administrador por defecto
    FIRST_SUPERUSER: str = "admin@amacars.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"
    
    # Company Info
    COMPANY_NAME: str = "AMACARS"
    COMPANY_ADDRESS: str = "Calle Principal #123, Ciudad"
    COMPANY_PHONE: str = "+34 123 456 789"
    COMPANY_EMAIL: EmailStr = "info@amacars.com"
    
    # PDF
    PDF_OUTPUT_DIR: str = "pdfs"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 