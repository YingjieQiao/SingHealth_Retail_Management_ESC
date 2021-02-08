from flask import Flask

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    
    with app.app_context():
        from app.apis import apis
        app.register_blueprint(apis)

    return app