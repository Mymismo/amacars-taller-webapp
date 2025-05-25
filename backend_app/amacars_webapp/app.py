from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS
import os

# Inicializar la aplicación Flask
app = Flask(__name__)

# Configuración de la aplicación
app.config['SECRET_KEY'] = 'amacars-secret-key-2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://amacars_user:amacars_password@localhost/amacars_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de correo
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = None
app.config['MAIL_PASSWORD'] = None

# Inicializar extensiones
db = SQLAlchemy(app)
mail = Mail(app)
CORS(app)

# Importar rutas
from src.routes import auth, vehiculo, cita, kilometraje, servicio_taller, reminder

# Registrar blueprints
app.register_blueprint(auth.auth_bp, url_prefix='/api/auth')
app.register_blueprint(vehiculo.bp, url_prefix='/api/vehiculos')
app.register_blueprint(cita.bp, url_prefix='/api/citas')
app.register_blueprint(kilometraje.bp, url_prefix='/api/kilometraje')
app.register_blueprint(servicio_taller.bp, url_prefix='/api/servicios_taller')
app.register_blueprint(reminder.bp, url_prefix='/api/reminders')

if __name__ == '__main__':
    with app.app_context():
        # Crear todas las tablas de la base de datos
        db.create_all()
    app.run(debug=True, load_dotenv=False) 