import os
from dotenv import load_dotenv

load_dotenv() 


# Lokasi direktori saat ini (misalnya lokasi file app.py)
BASE_DIR            = os.path.dirname(os.path.abspath(__file__))
DATA_DIR            = os.path.join(BASE_DIR, 'data')
GAME_DIR            = os.path.join(BASE_DIR, 'static', 'games')

# Buat folder jika belum ada
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(GAME_DIR, exist_ok=True)


MAX_SPEAK_WORDS     = 150

ALLOWED_REFERERS    = [
    'http://localhost:5000',
    'https://learnwithnasya.my.id',
]


# Path untuk file statistik
GENERIC_STAT_FILE    = os.path.join(DATA_DIR, 'visitor_statistic.csv')
GENERIC_STATS_FIELDS = ['ip', 'user_agent', 'url', 'path', 'method', 'referrer', 'timestamp']
GAME_STAT_FILE       = os.path.join(DATA_DIR, 'game_visitor_counter.json')
TRACKED_ROUTES       = {
    '/'                : 'index',
    '/game/list'       : 'game_list',
    '/play/<game_id>'  : 'play_game',
    '/page/<page_name>': 'view_static_page'
}


# File upload settings
UPLOAD_FOLDER      = os.path.join(BASE_DIR, 'static/uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 2 * 1024 * 1024  # 2MB

# Ensure the upload folder exists on startup
os.makedirs(os.path.join(UPLOAD_FOLDER, 'profile_pictures'), exist_ok=True)


class Config:
    # Wajib
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    # Database
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + DATA_DIR + "/" + os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = UPLOAD_FOLDER
    
    # Konfigurasi custom
    GAMES_DIR = GAME_DIR
    MAX_SPEAK_WORDS = 50
    