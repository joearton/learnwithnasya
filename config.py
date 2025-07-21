import os

# Lokasi direktori saat ini (misalnya lokasi file app.py)
BASE_DIR            = os.path.dirname(os.path.abspath(__file__))
GAME_DIR            = os.path.join(BASE_DIR, 'static', 'games')

MAX_SPEAK_WORDS     = 150

ALLOWED_REFERERS    = [
    'http://localhost:5000',
    'https://learnwithnasya.my.id',
]


# Path untuk file statistik
STATS_FILE      = 'visitor_stats.csv'
STATS_FIELDS    = ['ip', 'user_agent', 'url', 'path', 'method', 'referrer', 'timestamp']
TRACKED_ROUTES  = {
    '/': 'index',
    '/game/list': 'game_list',
    '/play/<game_id>': 'play_game',
    '/page/<page_name>': 'render_static_page'
}