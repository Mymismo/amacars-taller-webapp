from flask import Blueprint, request, jsonify, session
from datetime import datetime, timedelta
from src.models.models import db, User, Vehiculo, Cita, ServicioTaller, RegistroKilometraje
from src.notifications import send_email, get_service_reminder_email_html
from src.routes.auth import login_required, admin_required
from src.routes.vehiculo import roles_required
from flask_mail import Message
from src.extensions import mail

reminder_bp = Blueprint("reminder", __name__, url_prefix="/api/reminders")

# Función auxiliar para determinar si un vehículo podría necesitar servicio
def check_vehicle_for_service_reminder(vehiculo, meses_desde_ultimo_servicio=6, km_desde_ultimo_servicio=10000):
    """Verifica si un vehículo podría necesitar un recordatorio de servicio."""
    # Criterio 1: Tiempo desde el último servicio
    ultima_cita_completada = Cita.query.filter_by(vehiculo_id=vehiculo.id, estado="completada")\
                                      .order_by(Cita.fecha_actualizacion.desc()).first()
    
    necesita_recordatorio_tiempo = False
    if ultima_cita_completada:
        if (datetime.utcnow() - ultima_cita_completada.fecha_actualizacion) > timedelta(days=meses_desde_ultimo_servicio * 30):
            necesita_recordatorio_tiempo = True
    else:
        # Si no hay citas completadas, podría considerarse para un primer servicio si tiene cierta antigüedad o km
        # Por ahora, si no hay historial, no se genera recordatorio por tiempo basado en último servicio.
        pass 

    # Criterio 2: Kilometraje desde el último servicio (si hay km registrado en la última cita)
    necesita_recordatorio_km = False
    if ultima_cita_completada and ultima_cita_completada.kilometraje_entrada is not None and vehiculo.ultimo_kilometraje is not None:
        if (vehiculo.ultimo_kilometraje - ultima_cita_completada.kilometraje_entrada) >= km_desde_ultimo_servicio:
            necesita_recordatorio_km = True
    elif not ultima_cita_completada and vehiculo.ultimo_kilometraje is not None and vehiculo.ultimo_kilometraje >= km_desde_ultimo_servicio:
        # Si no hay cita previa pero el vehículo ya tiene un kilometraje considerable
        necesita_recordatorio_km = True
        
    return necesita_recordatorio_tiempo or necesita_recordatorio_km

@reminder_bp.route("/admin/sugerencias_servicio", methods=["GET"])
@roles_required(["admin"])
def get_suggested_service_reminders():
    """Devuelve una lista de vehículos que podrían necesitar un recordatorio de servicio."""
    # Parámetros de configuración para los recordatorios (podrían ser configurables por el admin en el futuro)
    meses_limite = int(request.args.get("meses_limite", 6))
    km_limite = int(request.args.get("km_limite", 10000))

    vehiculos_sugeridos = []
    todos_los_vehiculos = Vehiculo.query.join(User).filter(User.rol == "cliente").all()

    for v in todos_los_vehiculos:
        if check_vehicle_for_service_reminder(v, meses_limite, km_limite):
            ultima_cita_completada = Cita.query.filter_by(vehiculo_id=v.id, estado="completada")\
                                      .order_by(Cita.fecha_actualizacion.desc()).first()
            propietario = User.query.get(v.propietario_id)
            vehiculos_sugeridos.append({
                "vehiculo_id": v.id,
                "marca": v.marca,
                "modelo": v.modelo,
                "placa": v.placa,
                "propietario_nombre": propietario.nombre_completo if propietario else "N/A",
                "propietario_email": propietario.email if propietario else "N/A",
                "ultimo_kilometraje": v.ultimo_kilometraje,
                "fecha_ultimo_servicio": ultima_cita_completada.fecha_actualizacion.isoformat() if ultima_cita_completada else None,
                "km_ultimo_servicio": ultima_cita_completada.kilometraje_entrada if ultima_cita_completada and ultima_cita_completada.kilometraje_entrada is not None else None
            })
            
    return jsonify(vehiculos_sugeridos), 200

@reminder_bp.route("/admin/enviar_recordatorio/<int:vehiculo_id>", methods=["POST"])
@roles_required(["admin"])
def send_manual_service_reminder(vehiculo_id):
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    propietario = User.query.get(vehiculo.propietario_id)

    if not propietario or not propietario.email:
        return jsonify({"error": "El propietario del vehículo no tiene un email registrado."}), 400

    # Personalizar el mensaje del recordatorio si es necesario
    mensaje_personalizado = request.json.get("mensaje", "Hemos notado que podría ser momento para un nuevo servicio para tu vehículo.")

    email_html = get_service_reminder_email_html(
        nombre_cliente=propietario.nombre_completo,
        vehiculo_info=f"{vehiculo.marca} {vehiculo.modelo} ({vehiculo.placa})",
        mensaje_recordatorio=mensaje_personalizado
    )
    
    asunto = f"Recordatorio de Servicio para tu {vehiculo.marca} {vehiculo.modelo} - Amacars"

    if send_email(propietario.email, asunto, email_html):
        return jsonify({"message": f"Recordatorio de servicio enviado a {propietario.email}"}), 200
    else:
        return jsonify({"error": "No se pudo enviar el correo de recordatorio."}), 500

# Nota: La ejecución periódica y automática de `get_suggested_service_reminders` y el envío 
# automático de correos no es posible en este entorno sin un programador de tareas externo (cron job)
# o un servicio de background tasks. Esta implementación se basa en la acción manual del administrador.

@reminder_bp.route('/admin/sugerencias_servicio', methods=['GET'])
@admin_required
def get_sugerencias_servicio():
    # Obtener vehículos que no han tenido servicio en los últimos 6 meses
    fecha_limite = datetime.utcnow() - timedelta(days=180)
    
    vehiculos_sin_servicio = db.session.query(Vehiculo)\
        .outerjoin(Cita)\
        .filter(
            (Cita.fecha_hora_cita == None) |  # Nunca han tenido servicio
            (Cita.fecha_hora_cita < fecha_limite)  # Último servicio hace más de 6 meses
        ).all()
    
    sugerencias = []
    for vehiculo in vehiculos_sin_servicio:
        ultima_cita = Cita.query.filter_by(vehiculo_id=vehiculo.id)\
            .order_by(Cita.fecha_hora_cita.desc()).first()
        
        sugerencias.append({
            'vehiculo': {
                'id': vehiculo.id,
                'marca': vehiculo.marca,
                'modelo': vehiculo.modelo,
                'placa': vehiculo.placa,
                'ultimo_kilometraje': vehiculo.ultimo_kilometraje,
                'fecha_ultimo_kilometraje': vehiculo.fecha_ultimo_kilometraje.isoformat() if vehiculo.fecha_ultimo_kilometraje else None
            },
            'propietario': {
                'id': vehiculo.propietario.id,
                'nombre_completo': vehiculo.propietario.nombre_completo,
                'email': vehiculo.propietario.email,
                'telefono': vehiculo.propietario.telefono
            },
            'ultima_cita': {
                'fecha': ultima_cita.fecha_hora_cita.isoformat() if ultima_cita else None,
                'servicio': ultima_cita.servicio.nombre if ultima_cita else None
            } if ultima_cita else None
        })
    
    return jsonify(sugerencias)

@reminder_bp.route('/admin/enviar_recordatorio/<int:vehiculo_id>', methods=['POST'])
@admin_required
def enviar_recordatorio(vehiculo_id):
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    
    try:
        # Crear mensaje de correo
        msg = Message(
            'Recordatorio de Servicio - Amacars Taller',
            recipients=[vehiculo.propietario.email]
        )
        
        # Contenido del correo
        msg.html = f"""
        <h2>Recordatorio de Servicio para su Vehículo</h2>
        <p>Estimado/a {vehiculo.propietario.nombre_completo},</p>
        <p>Le recordamos que su vehículo:</p>
        <ul>
            <li>Marca: {vehiculo.marca}</li>
            <li>Modelo: {vehiculo.modelo}</li>
            <li>Placa: {vehiculo.placa}</li>
        </ul>
        <p>No ha recibido servicio en nuestro taller recientemente. Para mantener su vehículo en óptimas condiciones,
        le recomendamos agendar una cita para revisión general.</p>
        <p>Puede agendar su cita a través de nuestra plataforma web o llamando a nuestros números de contacto.</p>
        <p>¡Gracias por confiar en Amacars Taller!</p>
        """
        
        # Enviar correo
        mail.send(msg)
        
        return jsonify({
            'message': 'Recordatorio enviado exitosamente',
            'email': vehiculo.propietario.email
        })
    except Exception as e:
        return jsonify({'error': 'Error al enviar el recordatorio'}), 500

