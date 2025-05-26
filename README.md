# AMACARS - Sistema de Gestión para Taller Mecánico

Sistema web para la gestión de un taller mecánico, desarrollado con FastAPI (Backend) y React + TypeScript (Frontend).

## Características

- Gestión de clientes y vehículos
- Sistema de citas y servicios
- Presupuestos y facturación
- Notificaciones y seguimiento
- Panel de administración
- Interfaz responsive y moderna

## Tecnologías Utilizadas

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- MySQL

### Frontend
- React
- TypeScript
- Chakra UI
- Vite

## Requisitos

- Python 3.8+
- Node.js 16+
- MySQL

## Instalación

### Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Ejecución

### Backend

```bash
cd backend
.\.venv\Scripts\activate  # Windows
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run dev
```

## Estructura del Proyecto

```
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   └── schemas/
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   └── types/
    └── package.json
```

## Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. 