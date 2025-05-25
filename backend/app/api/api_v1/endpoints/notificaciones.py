from typing import Any, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.notificacion import Notificacion, NotificacionCreate, NotificacionUpdate
from app.models.notificacion import Notificacion as NotificacionModel, TipoNotificacion
from app.models.usuario import Usuario as UsuarioModel
from app.models.grupo_clientes import GrupoClientes as GrupoClientesModel

router = APIRouter()

@router.get("/", response_model=List[Notificacion])
def get_notificaciones(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener lista de notificaciones del usuario actual.
    """
    return db.query(NotificacionModel).filter(
        NotificacionModel.usuario_id == current_user.id
    ).order_by(NotificacionModel.fecha.desc()).offset(skip).limit(limit).all()

@router.post("/", response_model=Notificacion)
def create_notificacion(
    *,
    db: Session = Depends(deps.get_db),
    notificacion_in: NotificacionCreate,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Crear nueva notificación.
    Solo administradores pueden crear notificaciones.
    """
    # Verificar que el usuario existe
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == notificacion_in.usuario_id).first()
    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    
    # Si es una notificación de grupo, verificar que el grupo existe
    if notificacion_in.grupo_id:
        grupo = db.query(GrupoClientesModel).filter(GrupoClientesModel.id == notificacion_in.grupo_id).first()
        if not grupo:
            raise HTTPException(
                status_code=404,
                detail="Grupo no encontrado"
            )
    
    notificacion = NotificacionModel(
        **notificacion_in.model_dump(),
        fecha=datetime.utcnow()
    )
    db.add(notificacion)
    db.commit()
    db.refresh(notificacion)
    return notificacion

@router.get("/no-leidas", response_model=List[Notificacion])
def get_notificaciones_no_leidas(
    db: Session = Depends(deps.get_db),
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener notificaciones no leídas del usuario actual.
    """
    return db.query(NotificacionModel).filter(
        NotificacionModel.usuario_id == current_user.id,
        NotificacionModel.leida == False
    ).order_by(NotificacionModel.fecha.desc()).all()

@router.put("/{notificacion_id}/marcar-leida", response_model=Notificacion)
def marcar_notificacion_leida(
    *,
    db: Session = Depends(deps.get_db),
    notificacion_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Marcar una notificación como leída.
    """
    notificacion = db.query(NotificacionModel).filter(NotificacionModel.id == notificacion_id).first()
    if not notificacion:
        raise HTTPException(
            status_code=404,
            detail="Notificación no encontrada"
        )
    
    if notificacion.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para modificar esta notificación"
        )
    
    notificacion.leida = True
    db.add(notificacion)
    db.commit()
    db.refresh(notificacion)
    return notificacion

@router.post("/grupo/{grupo_id}", response_model=List[Notificacion])
def create_notificacion_grupo(
    *,
    db: Session = Depends(deps.get_db),
    grupo_id: int,
    notificacion_in: NotificacionCreate,
    current_user: UsuarioModel = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Crear notificación para todos los usuarios de un grupo.
    Solo administradores pueden crear notificaciones grupales.
    """
    # Verificar que el grupo existe
    grupo = db.query(GrupoClientesModel).filter(GrupoClientesModel.id == grupo_id).first()
    if not grupo:
        raise HTTPException(
            status_code=404,
            detail="Grupo no encontrado"
        )
    
    notificaciones = []
    for usuario in grupo.usuarios:
        notificacion = NotificacionModel(
            usuario_id=usuario.id,
            tipo=notificacion_in.tipo,
            titulo=notificacion_in.titulo,
            mensaje=notificacion_in.mensaje,
            fecha=datetime.utcnow(),
            grupo_id=grupo_id,
            accion=notificacion_in.accion
        )
        db.add(notificacion)
        notificaciones.append(notificacion)
    
    db.commit()
    for notificacion in notificaciones:
        db.refresh(notificacion)
    
    return notificaciones

@router.delete("/{notificacion_id}", response_model=Notificacion)
def delete_notificacion(
    *,
    db: Session = Depends(deps.get_db),
    notificacion_id: int,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Eliminar una notificación.
    - Los usuarios solo pueden eliminar sus propias notificaciones
    - Los administradores pueden eliminar cualquier notificación
    """
    notificacion = db.query(NotificacionModel).filter(NotificacionModel.id == notificacion_id).first()
    if not notificacion:
        raise HTTPException(
            status_code=404,
            detail="Notificación no encontrada"
        )
    
    if current_user.rol != "admin" and notificacion.usuario_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="No tiene permisos para eliminar esta notificación"
        )
    
    db.delete(notificacion)
    db.commit()
    return notificacion

@router.get("/tipo/{tipo}", response_model=List[Notificacion])
def get_notificaciones_by_tipo(
    *,
    db: Session = Depends(deps.get_db),
    tipo: TipoNotificacion,
    current_user: UsuarioModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Obtener notificaciones por tipo.
    """
    return db.query(NotificacionModel).filter(
        NotificacionModel.usuario_id == current_user.id,
        NotificacionModel.tipo == tipo
    ).order_by(NotificacionModel.fecha.desc()).all() 