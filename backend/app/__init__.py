from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from app.models import db
from app.config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config.from_object(config_class)
    
    db.init_app(app)
    bcrypt = Bcrypt(app)
    
    from app.apis import apis
    app.register_blueprint(apis)

    return app