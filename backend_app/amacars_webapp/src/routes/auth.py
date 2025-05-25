from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from src.models.models import User, db
from functools import wraps

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Debe iniciar sesión'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Debe iniciar sesión'}), 401
        user = User.query.get(session['user_id'])
        if not user or user.rol != 'admin':
            return jsonify({'error': 'Se requieren permisos de administrador'}), 403
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    nombre_completo = data.get("nombre_completo")
    email = data.get("email")
    telefono = data.get("telefono")
    password = data.get("password")
    rol = data.get("rol", "cliente")  # Default to cliente if not specified

    if not nombre_completo or not email or not password:
        return jsonify({"error": "Nombre completo, email y contraseña son requeridos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "El correo electrónico ya está registrado"}), 409

    new_user = User(nombre_completo=nombre_completo, email=email, telefono=telefono, rol=rol)
    new_user.set_password(password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
        # Crear sesión para el nuevo usuario
        session["user_id"] = new_user.id
        session["user_rol"] = new_user.rol
        return jsonify({
            "message": "Usuario registrado exitosamente", 
            "user": {"id": new_user.id, "nombre": new_user.nombre_completo, "email": new_user.email, "rol": new_user.rol}
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al registrar el usuario", "details": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    session["user_id"] = user.id
    session["user_rol"] = user.rol
    
    return jsonify({
        "message": "Inicio de sesión exitoso",
        "user": {"id": user.id, "nombre": user.nombre_completo, "email": user.email, "rol": user.rol}
    }), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    session.pop("user_rol", None)
    return jsonify({"message": "Cierre de sesión exitoso"}), 200

@auth_bp.route("/status", methods=["GET"])
def status():
    user_id = session.get("user_id")
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify({
                "logged_in": True, 
                "user": {"id": user.id, "nombre": user.nombre_completo, "email": user.email, "rol": user.rol}
            }), 200
    return jsonify({"logged_in": False}), 200

# Aquí se podrían añadir rutas para gestión de perfiles, cambio de contraseña, etc.

