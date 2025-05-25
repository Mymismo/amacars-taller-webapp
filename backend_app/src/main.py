from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.connection import engine, Base
from .routes import clientes, vehiculos, servicios, citas

# Crear las tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AMACARS API")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(clientes.router, prefix="/api/clientes", tags=["clientes"])
app.include_router(vehiculos.router, prefix="/api/vehiculos", tags=["vehiculos"])
app.include_router(servicios.router, prefix="/api/servicios", tags=["servicios"])
app.include_router(citas.router, prefix="/api/citas", tags=["citas"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de AMACARS"} 