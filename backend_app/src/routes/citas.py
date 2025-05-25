from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.cita import Cita, CitaServicio, EstadoCita
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

router = APIRouter()

class CitaServicioBase(BaseModel):
    servicio_id: int
    precio_aplicado: Decimal

class CitaBase(BaseModel):
    cliente_id: int
    vehiculo_id: int
    fecha_hora: datetime
    notas: str = None
    servicios: List[CitaServicioBase]

class CitaCreate(CitaBase):
    pass

class CitaServicioResponse(CitaServicioBase):
    cita_id: int

    class Config:
        orm_mode = True

class CitaResponse(BaseModel):
    id: int
    cliente_id: int
    vehiculo_id: int
    fecha_hora: datetime
    estado: EstadoCita
    notas: str = None
    servicios: List[CitaServicioResponse]

    class Config:
        orm_mode = True

@router.post("/", response_model=CitaResponse)
def crear_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    # Crear la cita
    db_cita = Cita(
        cliente_id=cita.cliente_id,
        vehiculo_id=cita.vehiculo_id,
        fecha_hora=cita.fecha_hora,
        notas=cita.notas,
        estado=EstadoCita.pendiente
    )
    db.add(db_cita)
    
    try:
        db.commit()
        db.refresh(db_cita)
        
        # Crear las relaciones con servicios
        for servicio in cita.servicios:
            db_cita_servicio = CitaServicio(
                cita_id=db_cita.id,
                servicio_id=servicio.servicio_id,
                precio_aplicado=servicio.precio_aplicado
            )
            db.add(db_cita_servicio)
        
        db.commit()
        db.refresh(db_cita)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al crear la cita")
    
    return db_cita

@router.get("/", response_model=List[CitaResponse])
def listar_citas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    citas = db.query(Cita).offset(skip).limit(limit).all()
    return citas

@router.get("/cliente/{cliente_id}", response_model=List[CitaResponse])
def listar_citas_por_cliente(cliente_id: int, db: Session = Depends(get_db)):
    citas = db.query(Cita).filter(Cita.cliente_id == cliente_id).all()
    return citas

@router.get("/vehiculo/{vehiculo_id}", response_model=List[CitaResponse])
def listar_citas_por_vehiculo(vehiculo_id: int, db: Session = Depends(get_db)):
    citas = db.query(Cita).filter(Cita.vehiculo_id == vehiculo_id).all()
    return citas

@router.get("/{cita_id}", response_model=CitaResponse)
def obtener_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if cita is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita

@router.put("/{cita_id}/estado")
def actualizar_estado_cita(cita_id: int, estado: EstadoCita, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if cita is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    cita.estado = estado
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al actualizar el estado de la cita")
    return {"message": "Estado de la cita actualizado"}

@router.delete("/{cita_id}")
def eliminar_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if cita is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    try:
        db.delete(cita)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al eliminar la cita")
    return {"message": "Cita eliminada"} 