from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.usuario import Usuario, RolUsuario
from app.core.security import get_password_hash
from app.core.config import settings

def create_admin_user():
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Verificar si el usuario ya existe
        admin = db.query(Usuario).filter(Usuario.email == "admin@amacars.com").first()
        if not admin:
            admin = Usuario(
                email="admin@amacars.com",
                hashed_password=get_password_hash("admin123"),
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
            print("Email: admin@amacars.com")
            print("Contraseña: admin123")
        else:
            print("El usuario administrador ya existe")
            print("Email: admin@amacars.com")
            print("Contraseña: admin123")
    except Exception as e:
        print(f"Error al crear el usuario administrador: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user() 