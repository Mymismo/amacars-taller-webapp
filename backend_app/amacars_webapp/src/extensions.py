from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Inicializar extensiones
db = SQLAlchemy()
mail = Mail()
cors = CORS() 