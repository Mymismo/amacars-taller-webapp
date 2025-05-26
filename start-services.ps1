# Activar el entorno virtual
$env:PYTHONPATH = ".\backend"
.\backend\.venv\Scripts\Activate.ps1

# Iniciar el backend en una nueva ventana
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# Esperar un momento para que el backend inicie
Start-Sleep -Seconds 2

# Iniciar el frontend
cd frontend
npm run dev 