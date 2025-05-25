# AMACARS - Sistema de Gestión de Taller Mecánico

## Descripción
Sistema web para la gestión de un taller mecánico que permite administrar clientes, vehículos, servicios y citas.

## Tecnologías Utilizadas
- Backend: FastAPI + SQLAlchemy + MySQL
- Frontend: React + TypeScript + Vite

## Estructura del Proyecto
```
.
├── backend_app/
│   ├── src/
│   │   ├── database/
│   │   ├── models/
│   │   └── routes/
│   └── reset_db.py
└── frontend/
    └── src/
```

## Requisitos
- Python 3.8+
- Node.js 14+
- MySQL 8.0+

## Configuración del Entorno

### Backend
1. Crear entorno virtual:
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows
```

2. Instalar dependencias:
```bash
cd backend_app
pip install -r requirements.txt
```

3. Configurar base de datos:
```bash
python reset_db.py
```

4. Iniciar servidor:
```bash
uvicorn src.main:app --reload --port 5000
```

### Frontend
1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Iniciar servidor de desarrollo:
```bash
npm run dev
```

## Características
- Gestión de clientes (CRUD)
- Gestión de vehículos
- Gestión de servicios
- Programación de citas
- Registro de kilometraje
- Relaciones entre entidades con eliminación en cascada

## API Endpoints

### Clientes
- GET /api/clientes/ - Listar clientes
- GET /api/clientes/{id} - Obtener cliente
- POST /api/clientes/ - Crear cliente
- PUT /api/clientes/{id} - Actualizar cliente
- DELETE /api/clientes/{id} - Eliminar cliente

### Vehículos
- GET /api/vehiculos/ - Listar vehículos
- GET /api/vehiculos/{id} - Obtener vehículo
- POST /api/vehiculos/ - Crear vehículo
- PUT /api/vehiculos/{id} - Actualizar vehículo
- DELETE /api/vehiculos/{id} - Eliminar vehículo

### Servicios
- GET /api/servicios/ - Listar servicios
- GET /api/servicios/{id} - Obtener servicio
- POST /api/servicios/ - Crear servicio
- PUT /api/servicios/{id} - Actualizar servicio
- DELETE /api/servicios/{id} - Eliminar servicio

### Citas
- GET /api/citas/ - Listar citas
- GET /api/citas/{id} - Obtener cita
- POST /api/citas/ - Crear cita
- PUT /api/citas/{id} - Actualizar cita
- DELETE /api/citas/{id} - Eliminar cita

## Contribución
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request 