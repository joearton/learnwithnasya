import os
from flask import Flask
from config import *
from extensions import db, login_manager
from helpers import middleware
from blueprints import admin as admin_manager
from helpers.default_user import create_default_admin_user

   
def create_app():
    app = Flask(__name__)
    
    # Konfigurasi
    app.config.from_object(Config)
    
    # Inisialisasi ekstensi
    db.init_app(app)
    middleware.init_app(app) 
    login_manager.init_app(app)
    admin_manager.init_app(app) 
        
    # Register blueprints
    from blueprints.main import main_bp
    from blueprints.auth import auth_bp
    from blueprints.games import games_bp
    from blueprints.stats import stats_bp
    from blueprints.tts import tts_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(games_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(tts_bp)
        
    # Buat tabel database
    with app.app_context():
        db.create_all()
        create_default_admin_user()    
    return app


app = create_app()


if __name__ == '__main__':
    app.run(debug = os.environ.get('FLASK_DEBUG', 'False').lower() in ['true', '1'])