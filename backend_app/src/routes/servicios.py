from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.servicio import Servicio
from pydantic import BaseModel
from decimal import Decimal

router = APIRouter()

class ServicioBase(BaseModel):
    nombre: str
    descripcion: str
    precio: Decimal
    duracion_estimada: int
    estado: bool = True

class ServicioCreate(ServicioBase):
    pass

class ServicioResponse(ServicioBase):
    id: int

    class Config:
        orm_mode = True

@router.post("/", response_model=ServicioResponse)
def crear_servicio(servicio: ServicioCreate, db: Session = Depends(get_db)):
    db_servicio = Servicio(**servicio.dict())
    db.add(db_servicio)
    try:
        db.commit()
        db.refresh(db_servicio)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al crear el servicio")
    return db_servicio

@router.get("/", response_model=List[ServicioResponse])
def listar_servicios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    servicios = db.query(Servicio).filter(Servicio.estado == True).offset(skip).limit(limit).all()
    return servicios

@router.get("/{servicio_id}", response_model=ServicioResponse)
def obtener_servicio(servicio_id: int, db: Session = Depends(get_db)):
    servicio = db.query(Servicio).filter(Servicio.id == servicio_id).first()
    if servicio is None:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return servicio

@router.put("/{servicio_id}", response_model=ServicioResponse)
def actualizar_servicio(servicio_id: int, servicio: ServicioCreate, db: Session = Depends(get_db)):
    db_servicio = db.query(Servicio).filter(Servicio.id == servicio_id).first()
    if db_servicio is None:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    
    for key, value in servicio.dict().items():
        setattr(db_servicio, key, value)
    
    try:
        db.commit()
        db.refresh(db_servicio)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al actualizar el servicio")
    return db_servicio

@router.delete("/{servicio_id}")
def eliminar_servicio(servicio_id: int, db: Session = Depends(get_db)):
    servicio = db.query(Servicio).filter(Servicio.id == servicio_id).first()
    if servicio is None:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    
    # Soft delete
    servicio.estado = False
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al eliminar el servicio")
    return {"message": "Servicio eliminado"} 