from flask import Blueprint, request, jsonify, session
from src.models.models import User, Vehiculo, db # Asegúrate que User, Vehiculo y db se importan correctamente
from functools import wraps
from .auth import login_required, admin_required

vehiculo_bp = Blueprint("vehiculo", __name__, url_prefix="/api/vehiculos")

# Decorador para verificar roles (simplificado, se puede expandir)
def roles_required(roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = session.get("user_id")
            user_rol = session.get("user_rol")
            if not user_id or user_rol not in roles:
                return jsonify({"error": "Acceso no autorizado para este rol"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# --- Rutas para Clientes --- (Requieren estar logueados como cliente o admin)
@vehiculo_bp.route("/mis_vehiculos", methods=["GET"])
@login_required
def get_mis_vehiculos():
    user_id = session.get("user_id")
    vehiculos = Vehiculo.query.filter_by(propietario_id=user_id).all()
    return jsonify([{
        'id': v.id,
        'marca': v.marca,
        'modelo': v.modelo,
        'ano': v.ano,
        'placa': v.placa,
        'vin': v.vin,
        'color': v.color,
        'ultimo_kilometraje': v.ultimo_kilometraje,
        'fecha_ultimo_kilometraje': v.fecha_ultimo_kilometraje.isoformat() if v.fecha_ultimo_kilometraje else None
    } for v in vehiculos])

@vehiculo_bp.route("/", methods=["POST"])
@login_required
def crear_vehiculo():
    data = request.get_json()
    
    # Validar datos requeridos
    required_fields = ['marca', 'modelo', 'ano', 'placa']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'El campo {field} es requerido'}), 400
    
    # Verificar si la placa ya existe
    if Vehiculo.query.filter_by(placa=data['placa']).first():
        return jsonify({'error': 'La placa ya está registrada'}), 400
    
    # Verificar VIN si se proporciona
    if 'vin' in data and data['vin']:
        if Vehiculo.query.filter_by(vin=data['vin']).first():
            return jsonify({'error': 'El VIN ya está registrado'}), 400
    
    nuevo_vehiculo = Vehiculo(
        marca=data['marca'],
        modelo=data['modelo'],
        ano=data['ano'],
        placa=data['placa'],
        vin=data.get('vin'),
        color=data.get('color'),
        propietario_id=session.get('user_id'),
        ultimo_kilometraje=data.get('kilometraje', 0)
    )
    
    try:
        db.session.add(nuevo_vehiculo)
        db.session.commit()
        return jsonify({
            'message': 'Vehículo registrado exitosamente',
            'vehiculo': {
                'id': nuevo_vehiculo.id,
                'marca': nuevo_vehiculo.marca,
                'modelo': nuevo_vehiculo.modelo,
                'ano': nuevo_vehiculo.ano,
                'placa': nuevo_vehiculo.placa
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al registrar el vehículo'}), 500

@vehiculo_bp.route("/<int:vehiculo_id>", methods=["PUT"])
@login_required
def actualizar_vehiculo(vehiculo_id):
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    
    # Verificar que el usuario sea el propietario o un admin
    if session.get('user_id') != vehiculo.propietario_id:
        user = User.query.get(session.get('user_id'))
        if not user or user.rol != 'admin':
            return jsonify({'error': 'No autorizado'}), 403
    
    data = request.get_json()
    
    # Verificar si la placa nueva ya existe (si se está cambiando)
    if 'placa' in data and data['placa'] != vehiculo.placa:
        if Vehiculo.query.filter_by(placa=data['placa']).first():
            return jsonify({'error': 'La placa ya está registrada'}), 400
    
    # Verificar si el VIN nuevo ya existe (si se está cambiando)
    if 'vin' in data and data['vin'] and data['vin'] != vehiculo.vin:
        if Vehiculo.query.filter_by(vin=data['vin']).first():
            return jsonify({'error': 'El VIN ya está registrado'}), 400
    
    try:
        for key, value in data.items():
            if hasattr(vehiculo, key):
                setattr(vehiculo, key, value)
        
        db.session.commit()
        return jsonify({
            'message': 'Vehículo actualizado exitosamente',
            'vehiculo': {
                'id': vehiculo.id,
                'marca': vehiculo.marca,
                'modelo': vehiculo.modelo,
                'ano': vehiculo.ano,
                'placa': vehiculo.placa
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar el vehículo'}), 500

@vehiculo_bp.route("/<int:vehiculo_id>", methods=["DELETE"])
@login_required
def eliminar_vehiculo(vehiculo_id):
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    
    # Verificar que el usuario sea el propietario o un admin
    if session.get('user_id') != vehiculo.propietario_id:
        user = User.query.get(session.get('user_id'))
        if not user or user.rol != 'admin':
            return jsonify({'error': 'No autorizado'}), 403
    
    try:
        db.session.delete(vehiculo)
        db.session.commit()
        return jsonify({'message': 'Vehículo eliminado exitosamente'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar el vehículo'}), 500

# --- Rutas específicas para Administradores ---
@vehiculo_bp.route("/admin/all", methods=["GET"])
@admin_required
def get_all_vehiculos():
    vehiculos = Vehiculo.query.all()
    return jsonify([{
        'id': v.id,
        'marca': v.marca,
        'modelo': v.modelo,
        'ano': v.ano,
        'placa': v.placa,
        'vin': v.vin,
        'color': v.color,
        'propietario': {
            'id': v.propietario.id,
            'nombre_completo': v.propietario.nombre_completo,
            'email': v.propietario.email
        },
        'ultimo_kilometraje': v.ultimo_kilometraje,
        'fecha_ultimo_kilometraje': v.fecha_ultimo_kilometraje.isoformat() if v.fecha_ultimo_kilometraje else None
    } for v in vehiculos])

@vehiculo_bp.route("/admin/cliente/<int:cliente_id>", methods=["GET"])
@admin_required
def get_vehiculos_cliente(cliente_id):
    cliente = User.query.get_or_404(cliente_id)
    vehiculos = Vehiculo.query.filter_by(propietario_id=cliente_id).all()
    return jsonify([{
        'id': v.id,
        'marca': v.marca,
        'modelo': v.modelo,
        'ano': v.ano,
        'placa': v.placa,
        'vin': v.vin,
        'color': v.color,
        'ultimo_kilometraje': v.ultimo_kilometraje,
        'fecha_ultimo_kilometraje': v.fecha_ultimo_kilometraje.isoformat() if v.fecha_ultimo_kilometraje else None
    } for v in vehiculos])

