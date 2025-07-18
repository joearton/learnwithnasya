import os

# Lokasi direktori saat ini (misalnya lokasi file app.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

GAME_DIR = os.path.join(BASE_DIR, 'static', 'games')
