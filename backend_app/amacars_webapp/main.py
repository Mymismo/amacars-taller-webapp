from flask import Flask, send_from_directory
from src.extensions import db, mail, cors
import os
import mimetypes

# Agregar tipo MIME para SVG
mimetypes.add_type('image/svg+xml', '.svg')

# Inicializar la aplicación Flask
app = Flask(__name__, static_folder='static')

# Configuración de la aplicación
app.config['SECRET_KEY'] = 'clave-secreta-temporal'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:My_Root1975@localhost/amacars_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de correo
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = None
app.config['MAIL_PASSWORD'] = None

# Inicializar extensiones
db.init_app(app)
mail.init_app(app)
cors.init_app(app, resources={
    r"/api/*": {"origins": ["http://localhost:5173"]},
    r"/static/*": {"origins": ["http://localhost:5173"]}
})

# Importar rutas después de crear la aplicación para evitar importaciones circulares
from src.routes import auth, vehiculo, cita, kilometraje, servicio_taller, reminder

# Registrar blueprints
app.register_blueprint(auth.auth_bp, url_prefix='/api/auth')
app.register_blueprint(vehiculo.vehiculo_bp, url_prefix='/api/vehiculos')
app.register_blueprint(cita.cita_bp, url_prefix='/api/citas')
app.register_blueprint(kilometraje.kilometraje_bp, url_prefix='/api/kilometraje')
app.register_blueprint(servicio_taller.servicio_taller_bp, url_prefix='/api/servicios_taller')
app.register_blueprint(reminder.reminder_bp, url_prefix='/api/reminders')

# Ruta para servir archivos estáticos
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    with app.app_context():
        # Crear todas las tablas de la base de datos
        db.create_all()
    # Ejecutar en puerto 5000 y permitir acceso desde cualquier host
    app.run(host='0.0.0.0', port=5000, debug=True)

