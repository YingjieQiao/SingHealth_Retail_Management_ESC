from flask import Flask
from app.models import db
from app.config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    
    from app.apis import apis
    app.register_blueprint(apis)

    return app