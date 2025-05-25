from flask import Blueprint, request, jsonify, session
from datetime import datetime
from src.models.models import db, Cita, User, Vehiculo, ServicioTaller
from src.routes.auth import login_required, admin_required

cita_bp = Blueprint('cita', __name__)

@cita_bp.route('/solicitar', methods=['POST'])
@login_required
def solicitar_cita():
    data = request.get_json()
    
    # Validar datos requeridos
    required_fields = ['vehiculo_id', 'servicio_id', 'fecha_hora_cita']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'El campo {field} es requerido'}), 400
    
    # Verificar que el vehículo pertenece al usuario
    vehiculo = Vehiculo.query.get_or_404(data['vehiculo_id'])
    if vehiculo.propietario_id != session.get('user_id'):
        return jsonify({'error': 'No autorizado para agendar citas para este vehículo'}), 403
    
    # Verificar que el servicio existe
    servicio = ServicioTaller.query.get_or_404(data['servicio_id'])
    
    # Convertir fecha_hora_cita de string a datetime
    try:
        fecha_hora_cita = datetime.fromisoformat(data['fecha_hora_cita'].replace('Z', '+00:00'))
    except ValueError:
        return jsonify({'error': 'Formato de fecha y hora inválido'}), 400
    
    # Crear la cita
    nueva_cita = Cita(
        cliente_id=session.get('user_id'),
        vehiculo_id=data['vehiculo_id'],
        servicio_id=data['servicio_id'],
        fecha_hora_cita=fecha_hora_cita,
        notas_cliente=data.get('notas_cliente'),
        kilometraje_entrada=data.get('kilometraje_entrada')
    )
    
    try:
        db.session.add(nueva_cita)
        db.session.commit()
        return jsonify({
            'message': 'Cita agendada exitosamente',
            'cita': {
                'id': nueva_cita.id,
                'fecha_hora_cita': nueva_cita.fecha_hora_cita.isoformat(),
                'estado': nueva_cita.estado,
                'servicio': servicio.nombre
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al agendar la cita'}), 500

@cita_bp.route('/mis_citas', methods=['GET'])
@login_required
def get_mis_citas():
    citas = Cita.query.filter_by(cliente_id=session.get('user_id')).all()
    return jsonify([{
        'id': c.id,
        'fecha_hora_cita': c.fecha_hora_cita.isoformat(),
        'estado': c.estado,
        'vehiculo': {
            'id': c.vehiculo.id,
            'marca': c.vehiculo.marca,
            'modelo': c.vehiculo.modelo,
            'placa': c.vehiculo.placa
        },
        'servicio': {
            'id': c.servicio.id,
            'nombre': c.servicio.nombre,
            'costo_base': c.servicio.costo_base
        },
        'notas_cliente': c.notas_cliente,
        'notas_taller': c.notas_taller,
        'costo_final': c.costo_final,
        'kilometraje_entrada': c.kilometraje_entrada
    } for c in citas])

@cita_bp.route('/admin/all', methods=['GET'])
@admin_required
def get_all_citas():
    citas = Cita.query.all()
    return jsonify([{
        'id': c.id,
        'fecha_hora_cita': c.fecha_hora_cita.isoformat(),
        'estado': c.estado,
        'cliente': {
            'id': c.cliente.id,
            'nombre_completo': c.cliente.nombre_completo,
            'email': c.cliente.email,
            'telefono': c.cliente.telefono
        },
        'vehiculo': {
            'id': c.vehiculo.id,
            'marca': c.vehiculo.marca,
            'modelo': c.vehiculo.modelo,
            'placa': c.vehiculo.placa
        },
        'servicio': {
            'id': c.servicio.id,
            'nombre': c.servicio.nombre,
            'costo_base': c.servicio.costo_base
        },
        'notas_cliente': c.notas_cliente,
        'notas_taller': c.notas_taller,
        'costo_final': c.costo_final,
        'kilometraje_entrada': c.kilometraje_entrada
    } for c in citas])

@cita_bp.route('/admin/<int:cita_id>/actualizar_estado', methods=['PUT'])
@admin_required
def actualizar_estado_cita(cita_id):
    cita = Cita.query.get_or_404(cita_id)
    data = request.get_json()
    
    if 'estado' not in data:
        return jsonify({'error': 'El campo estado es requerido'}), 400
    
    estados_validos = ['solicitada', 'confirmada', 'cancelada', 'en_proceso', 'completada']
    if data['estado'] not in estados_validos:
        return jsonify({'error': f'Estado inválido. Debe ser uno de: {", ".join(estados_validos)}'}), 400
    
    try:
        cita.estado = data['estado']
        if 'notas_taller' in data:
            cita.notas_taller = data['notas_taller']
        if 'costo_final' in data:
            cita.costo_final = data['costo_final']
        
        db.session.commit()
        return jsonify({
            'message': 'Estado de la cita actualizado exitosamente',
            'cita': {
                'id': cita.id,
                'estado': cita.estado,
                'notas_taller': cita.notas_taller,
                'costo_final': cita.costo_final
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar el estado de la cita'}), 500

