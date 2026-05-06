from flask import Flask, make_response, jsonify, request
from routes.api import api
from routes.web import web
from extensions import db
import config

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(web)

    return app

if __name__ == '__main__':    
    create_app().run()