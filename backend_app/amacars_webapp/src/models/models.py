from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from src.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nombre_completo = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    password_hash = db.Column(db.String(256), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default='cliente')
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    vehiculos = db.relationship('Vehiculo', backref='propietario', lazy=True)
    citas = db.relationship('Cita', backref='cliente', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.id}: {self.email} ({self.rol})>"

class Vehiculo(db.Model):
    __tablename__ = "vehiculos"

    id = db.Column(db.Integer, primary_key=True)
    marca = db.Column(db.String(50), nullable=False)
    modelo = db.Column(db.String(50), nullable=False)
    ano = db.Column(db.Integer, nullable=False)
    placa = db.Column(db.String(20), unique=True, nullable=False)
    vin = db.Column(db.String(17), unique=True)
    color = db.Column(db.String(30))
    propietario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ultimo_kilometraje = db.Column(db.Integer)
    fecha_ultimo_kilometraje = db.Column(db.DateTime)

    # Relaciones
    citas = db.relationship('Cita', backref='vehiculo', lazy=True)
    registros_kilometraje = db.relationship('RegistroKilometraje', backref='vehiculo', lazy=True)

    def __repr__(self):
        return f"<Vehiculo {self.id}: {self.marca} {self.modelo} ({self.placa})>"

class RegistroKilometraje(db.Model):
    __tablename__ = "registros_kilometraje"
    id = db.Column(db.Integer, primary_key=True)
    vehiculo_id = db.Column(db.Integer, db.ForeignKey('vehiculos.id'), nullable=False)
    kilometraje = db.Column(db.Integer, nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<RegistroKilometraje {self.id}: Vehiculo {self.vehiculo_id} - {self.kilometraje}km el {self.fecha_registro}>"

# --- Modelos para Citas y Servicios (se definirán más adelante pero se incluyen referencias) ---
class ServicioTaller(db.Model):
    __tablename__ = "servicios_taller"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), unique=True, nullable=False)
    descripcion = db.Column(db.Text)
    tiempo_estimado_minutos = db.Column(db.Integer)
    costo_base = db.Column(db.Float)
    
    # Relaciones
    citas = db.relationship('Cita', backref='servicio', lazy=True)

    def __repr__(self):
        return f"<ServicioTaller {self.id}: {self.nombre}>"

class Cita(db.Model):
    __tablename__ = "citas"
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vehiculo_id = db.Column(db.Integer, db.ForeignKey('vehiculos.id'), nullable=False)
    servicio_id = db.Column(db.Integer, db.ForeignKey('servicios_taller.id'), nullable=False)
    fecha_hora_cita = db.Column(db.DateTime, nullable=False)
    estado = db.Column(db.String(20), nullable=False, default='solicitada')
    notas_cliente = db.Column(db.Text)
    notas_taller = db.Column(db.Text)
    costo_final = db.Column(db.Float)
    kilometraje_entrada = db.Column(db.Integer)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones (ya definidas en User y Vehiculo con backref)
    servicio_info = db.relationship("ServicioTaller", backref="citas_asociadas")

    def __repr__(self):
        return f"<Cita {self.id}: Vehiculo {self.vehiculo_id} para {self.fecha_hora_cita}>"

