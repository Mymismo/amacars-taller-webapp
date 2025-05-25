from flask import Blueprint, request, jsonify, session
from datetime import datetime
from src.models.models import db, RegistroKilometraje, Vehiculo, User
from src.routes.auth import login_required, admin_required

kilometraje_bp = Blueprint('kilometraje', __name__)

@kilometraje_bp.route('/registrar', methods=['POST'])
@login_required
def registrar_kilometraje():
    data = request.get_json()
    
    # Validar datos requeridos
    required_fields = ['vehiculo_id', 'kilometraje']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'El campo {field} es requerido'}), 400
    
    # Verificar que el vehículo existe y pertenece al usuario
    vehiculo = Vehiculo.query.get_or_404(data['vehiculo_id'])
    if vehiculo.propietario_id != session.get('user_id'):
        user = User.query.get(session.get('user_id'))
        if not user or user.rol != 'admin':
            return jsonify({'error': 'No autorizado para registrar kilometraje de este vehículo'}), 403
    
    # Validar que el kilometraje sea mayor al último registrado
    if vehiculo.ultimo_kilometraje and data['kilometraje'] <= vehiculo.ultimo_kilometraje:
        return jsonify({'error': 'El kilometraje debe ser mayor al último registrado'}), 400
    
    try:
        # Crear nuevo registro de kilometraje
        nuevo_registro = RegistroKilometraje(
            vehiculo_id=data['vehiculo_id'],
            kilometraje=data['kilometraje']
        )
        
        # Actualizar último kilometraje del vehículo
        vehiculo.ultimo_kilometraje = data['kilometraje']
        vehiculo.fecha_ultimo_kilometraje = datetime.utcnow()
        
        db.session.add(nuevo_registro)
        db.session.commit()
        
        return jsonify({
            'message': 'Kilometraje registrado exitosamente',
            'registro': {
                'id': nuevo_registro.id,
                'vehiculo_id': nuevo_registro.vehiculo_id,
                'kilometraje': nuevo_registro.kilometraje,
                'fecha_registro': nuevo_registro.fecha_registro.isoformat()
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al registrar el kilometraje'}), 500

@kilometraje_bp.route('/historial/<int:vehiculo_id>', methods=['GET'])
@login_required
def get_historial_kilometraje(vehiculo_id):
    # Verificar que el vehículo existe y el usuario tiene acceso
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    if vehiculo.propietario_id != session.get('user_id'):
        user = User.query.get(session.get('user_id'))
        if not user or user.rol != 'admin':
            return jsonify({'error': 'No autorizado para ver el historial de este vehículo'}), 403
    
    registros = RegistroKilometraje.query.filter_by(vehiculo_id=vehiculo_id)\
        .order_by(RegistroKilometraje.fecha_registro.desc()).all()
    
    return jsonify([{
        'id': r.id,
        'kilometraje': r.kilometraje,
        'fecha_registro': r.fecha_registro.isoformat()
    } for r in registros])

@kilometraje_bp.route('/admin/ultimo/<int:vehiculo_id>', methods=['GET'])
@admin_required
def get_ultimo_kilometraje(vehiculo_id):
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    
    return jsonify({
        'vehiculo_id': vehiculo.id,
        'ultimo_kilometraje': vehiculo.ultimo_kilometraje,
        'fecha_ultimo_kilometraje': vehiculo.fecha_ultimo_kilometraje.isoformat() if vehiculo.fecha_ultimo_kilometraje else None,
        'vehiculo_info': {
            'marca': vehiculo.marca,
            'modelo': vehiculo.modelo,
            'placa': vehiculo.placa
        }
    })

