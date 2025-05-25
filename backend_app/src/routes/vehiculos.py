from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.vehiculo import Vehiculo
from pydantic import BaseModel

router = APIRouter()

class VehiculoBase(BaseModel):
    cliente_id: int
    marca: str
    modelo: str
    ano: int
    placa: str
    color: str

class VehiculoCreate(VehiculoBase):
    pass

class VehiculoResponse(VehiculoBase):
    id: int

    class Config:
        orm_mode = True

@router.post("/", response_model=VehiculoResponse)
def crear_vehiculo(vehiculo: VehiculoCreate, db: Session = Depends(get_db)):
    db_vehiculo = Vehiculo(**vehiculo.dict())
    db.add(db_vehiculo)
    try:
        db.commit()
        db.refresh(db_vehiculo)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al crear el vehículo")
    return db_vehiculo

@router.get("/", response_model=List[VehiculoResponse])
def listar_vehiculos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    vehiculos = db.query(Vehiculo).offset(skip).limit(limit).all()
    return vehiculos

@router.get("/cliente/{cliente_id}", response_model=List[VehiculoResponse])
def listar_vehiculos_por_cliente(cliente_id: int, db: Session = Depends(get_db)):
    vehiculos = db.query(Vehiculo).filter(Vehiculo.cliente_id == cliente_id).all()
    return vehiculos

@router.get("/{vehiculo_id}", response_model=VehiculoResponse)
def obtener_vehiculo(vehiculo_id: int, db: Session = Depends(get_db)):
    vehiculo = db.query(Vehiculo).filter(Vehiculo.id == vehiculo_id).first()
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    return vehiculo

@router.put("/{vehiculo_id}", response_model=VehiculoResponse)
def actualizar_vehiculo(vehiculo_id: int, vehiculo: VehiculoCreate, db: Session = Depends(get_db)):
    db_vehiculo = db.query(Vehiculo).filter(Vehiculo.id == vehiculo_id).first()
    if db_vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    
    for key, value in vehiculo.dict().items():
        setattr(db_vehiculo, key, value)
    
    try:
        db.commit()
        db.refresh(db_vehiculo)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al actualizar el vehículo")
    return db_vehiculo

@router.delete("/{vehiculo_id}")
def eliminar_vehiculo(vehiculo_id: int, db: Session = Depends(get_db)):
    vehiculo = db.query(Vehiculo).filter(Vehiculo.id == vehiculo_id).first()
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    
    try:
        db.delete(vehiculo)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al eliminar el vehículo")
    return {"message": "Vehículo eliminado"} 