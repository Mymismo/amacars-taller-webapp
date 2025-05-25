from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.cliente import Cliente
from pydantic import BaseModel
from datetime import datetime
from ..models.cita import CitaServicio
from ..models.registro_kilometraje import RegistroKilometraje

router = APIRouter()

class ClienteBase(BaseModel):
    nombre: str
    apellidos: str
    telefono: str
    email: str
    direccion: str

class ClienteCreate(ClienteBase):
    pass

class ClienteResponse(ClienteBase):
    id: int
    fecha_registro: datetime

    class Config:
        orm_mode = True

@router.post("/", response_model=ClienteResponse)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = Cliente(**cliente.dict())
    db.add(db_cliente)
    try:
        db.commit()
        db.refresh(db_cliente)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al crear el cliente")
    return db_cliente

@router.get("/", response_model=List[ClienteResponse])
def listar_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = db.query(Cliente).offset(skip).limit(limit).all()
    return clientes

@router.get("/{cliente_id}", response_model=ClienteResponse)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.put("/{cliente_id}", response_model=ClienteResponse)
def actualizar_cliente(cliente_id: int, cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    for key, value in cliente.dict().items():
        setattr(db_cliente, key, value)
    
    try:
        db.commit()
        db.refresh(db_cliente)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error al actualizar el cliente")
    return db_cliente

@router.delete("/{cliente_id}")
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    try:
        # Primero, obtener el cliente y sus relaciones
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
        if cliente is None:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")

        # Eliminar primero las citas relacionadas
        for cita in cliente.citas:
            # Eliminar las relaciones cita-servicio primero
            db.query(CitaServicio).filter(CitaServicio.cita_id == cita.id).delete()
            db.delete(cita)

        # Eliminar los vehículos relacionados
        for vehiculo in cliente.vehiculos:
            # Eliminar registros de kilometraje si existen
            db.query(RegistroKilometraje).filter(RegistroKilometraje.vehiculo_id == vehiculo.id).delete()
            db.delete(vehiculo)

        # Finalmente, eliminar el cliente
        db.delete(cliente)
        db.commit()
        
        return {"message": "Cliente y sus datos relacionados eliminados correctamente"}
    except Exception as e:
        db.rollback()
        return HTTPException(status_code=400, detail=f"Error al eliminar el cliente: {str(e)}") 