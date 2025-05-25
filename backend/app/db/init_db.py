from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.usuario import Usuario, RolUsuario
from app.core.security import get_password_hash
from datetime import datetime

def init_db(db: Session) -> None:
    # Crear superusuario si no existe
    superuser = db.query(Usuario).filter(Usuario.email == settings.FIRST_SUPERUSER).first()
    if not superuser:
        superuser = Usuario(
            email=settings.FIRST_SUPERUSER,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            nombre="Admin",
            apellido="Sistema",
            telefono="123456789",
            direccion="Dirección del Sistema",
            rol=RolUsuario.ADMIN,
            activo=True,
            fecha_registro=datetime.utcnow()
        )
        db.add(superuser)
        db.commit()
        db.refresh(superuser)

    # Aquí puedes agregar más datos iniciales si lo necesitas
    # Por ejemplo, servicios predeterminados, categorías, etc. 