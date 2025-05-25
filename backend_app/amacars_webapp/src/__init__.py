from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Cargar variables de entorno
# load_dotenv()  # Comentado temporalmente

# Inicializar extensiones
db = SQLAlchemy()
mail = Mail()

def create_app():
    app = Flask(__name__)

    # Configuración de la aplicación
    app.config['SECRET_KEY'] = 'amacars-secret-key-2024'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:My_Root1975@localhost/amacars_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Configuración de correo
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = None
    app.config['MAIL_PASSWORD'] = None

    # Inicializar extensiones con la aplicación
    db.init_app(app)
    mail.init_app(app)
    
    # Configuración de CORS
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Importar y registrar blueprints
    from .routes import auth, vehiculo, cita, kilometraje, servicio_taller, reminder

    app.register_blueprint(auth.auth_bp, url_prefix='/api/auth')
    app.register_blueprint(vehiculo.bp, url_prefix='/api/vehiculos')
    app.register_blueprint(cita.bp, url_prefix='/api/citas')
    app.register_blueprint(kilometraje.bp, url_prefix='/api/kilometraje')
    app.register_blueprint(servicio_taller.bp, url_prefix='/api/servicios_taller')
    app.register_blueprint(reminder.bp, url_prefix='/api/reminders')

    return app
