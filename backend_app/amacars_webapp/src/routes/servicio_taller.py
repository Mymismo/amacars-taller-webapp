from flask import Blueprint, request, jsonify
from src.models.models import db, ServicioTaller
from src.routes.auth import login_required, admin_required

servicio_taller_bp = Blueprint('servicio_taller', __name__)

@servicio_taller_bp.route('/', methods=['GET'])
def get_servicios():
    servicios = ServicioTaller.query.all()
    return jsonify([{
        'id': s.id,
        'nombre': s.nombre,
        'descripcion': s.descripcion,
        'tiempo_estimado_minutos': s.tiempo_estimado_minutos,
        'costo_base': s.costo_base
    } for s in servicios])

@servicio_taller_bp.route('/admin', methods=['POST'])
@admin_required
def crear_servicio():
    data = request.get_json()
    
    # Validar datos requeridos
    if 'nombre' not in data:
        return jsonify({'error': 'El nombre del servicio es requerido'}), 400
    
    # Verificar si ya existe un servicio con el mismo nombre
    if ServicioTaller.query.filter_by(nombre=data['nombre']).first():
        return jsonify({'error': 'Ya existe un servicio con ese nombre'}), 400
    
    nuevo_servicio = ServicioTaller(
        nombre=data['nombre'],
        descripcion=data.get('descripcion'),
        tiempo_estimado_minutos=data.get('tiempo_estimado_minutos'),
        costo_base=data.get('costo_base')
    )
    
    try:
        db.session.add(nuevo_servicio)
        db.session.commit()
        return jsonify({
            'message': 'Servicio creado exitosamente',
            'servicio': {
                'id': nuevo_servicio.id,
                'nombre': nuevo_servicio.nombre,
                'descripcion': nuevo_servicio.descripcion,
                'tiempo_estimado_minutos': nuevo_servicio.tiempo_estimado_minutos,
                'costo_base': nuevo_servicio.costo_base
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al crear el servicio'}), 500

@servicio_taller_bp.route('/admin/<int:servicio_id>', methods=['PUT'])
@admin_required
def actualizar_servicio(servicio_id):
    servicio = ServicioTaller.query.get_or_404(servicio_id)
    data = request.get_json()
    
    # Verificar si el nuevo nombre ya existe (si se está cambiando)
    if 'nombre' in data and data['nombre'] != servicio.nombre:
        if ServicioTaller.query.filter_by(nombre=data['nombre']).first():
            return jsonify({'error': 'Ya existe un servicio con ese nombre'}), 400
    
    try:
        for key, value in data.items():
            if hasattr(servicio, key):
                setattr(servicio, key, value)
        
        db.session.commit()
        return jsonify({
            'message': 'Servicio actualizado exitosamente',
            'servicio': {
                'id': servicio.id,
                'nombre': servicio.nombre,
                'descripcion': servicio.descripcion,
                'tiempo_estimado_minutos': servicio.tiempo_estimado_minutos,
                'costo_base': servicio.costo_base
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar el servicio'}), 500

@servicio_taller_bp.route('/admin/<int:servicio_id>', methods=['DELETE'])
@admin_required
def eliminar_servicio(servicio_id):
    servicio = ServicioTaller.query.get_or_404(servicio_id)
    
    try:
        db.session.delete(servicio)
        db.session.commit()
        return jsonify({'message': 'Servicio eliminado exitosamente'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar el servicio. Verifique que no haya citas asociadas'}), 500

@servicio_taller_bp.route('/<int:servicio_id>', methods=['GET'])
def get_servicio(servicio_id):
    servicio = ServicioTaller.query.get_or_404(servicio_id)
    return jsonify({
        'id': servicio.id,
        'nombre': servicio.nombre,
        'descripcion': servicio.descripcion,
        'tiempo_estimado_minutos': servicio.tiempo_estimado_minutos,
        'costo_base': servicio.costo_base
    })

