from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from app.models import db
from app.config import Config
import logging


def create_app(config_class=Config):
    app = Flask(__name__)
    
    app.config.from_object(config_class)
    CORS(app, support_credentials=True,
        resources={r"/*": {"origins": "*"}})

    db.init_app(app)
    bcrypt = Bcrypt(app)

    
    logging.basicConfig(filename='backend_logs.log', 
        level=logging.DEBUG,
        format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
    logger = logging.getLogger("logger")
    logger.info("backend started")
    
    from app.apis import apis
    app.register_blueprint(apis)

    return app