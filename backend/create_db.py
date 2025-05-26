from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.core.config import settings
from app.models.usuario import Usuario, RolUsuario
from app.core.security import get_password_hash

def init_db() -> None:
    try:
        # Crear todas las tablas
        Base.metadata.create_all(bind=engine)
        print("Base de datos inicializada correctamente")

        # Crear usuario administrador
        db = SessionLocal()
        try:
            admin = db.query(Usuario).filter(Usuario.email == settings.FIRST_SUPERUSER).first()
            if not admin:
                admin = Usuario(
                    email=settings.FIRST_SUPERUSER,
                    hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                    nombre="Administrador",
                    apellidos="Sistema",
                    telefono="123456789",
                    rol=RolUsuario.ADMIN,
                    es_activo=True,
                    es_superusuario=True
                )
                db.add(admin)
                db.commit()
                print("Usuario administrador creado exitosamente")
                print(f"Email: {settings.FIRST_SUPERUSER}")
                print(f"Contraseña: {settings.FIRST_SUPERUSER_PASSWORD}")
            else:
                print("El usuario administrador ya existe")
        except Exception as e:
            print(f"Error al crear el usuario administrador: {e}")
        finally:
            db.close()
    except Exception as e:
        print(f"Error al inicializar la base de datos: {e}")

if __name__ == "__main__":
    init_db() 