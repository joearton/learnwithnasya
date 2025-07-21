import os
import io
from config import *
from gtts import gTTS
from helpers.metadata import load_game_metadata, update_game_metadata
from helpers.game import get_games_list
from helpers.stats import *
from flask import (
    Flask,
    request,
    abort,
    send_file,
    render_template,
    render_template_string
)


app = Flask(__name__)

# Gabungkan dengan subfolder 'static/games'
app.config['GAMES_DIR'] = GAME_DIR


@app.after_request
def after_request(response):
    """Middleware untuk mencatat request setelah selesai"""
    # Catat hanya route yang ingin dilacak
    for route in TRACKED_ROUTES:
        if request.path == route or (
            '<' in route and 
            request.path.startswith(route.split('<')[0])
        ):
            return record_visit(response)
    return response        


@app.route('/')
def index():
    games = get_games_list(limit = 9)
    return render_template('index.html', games=games)


@app.route('/game/list')
def game_list():
    # Parse parameters
    sort_mode = request.args.get('sort', 'name')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 6))
    search_query = request.args.get('search', '').strip()

    filters = {
        'search': search_query.lower() if search_query else None,
        'categories': request.args.getlist('categories'),
        'skills': request.args.getlist('skills'),
        'difficulty': request.args.get('difficulty', '').lower()
    }
    # Remove empty filters
    filters = {k: v for k, v in filters.items() if v}

    # Get ALL games (unfiltered) just once for filter options
    all_games_unfiltered = get_games_list(sort_mode=sort_mode, limit=None, filters=None)

    # Get unique categories and skills for filters
    all_categories = set()
    all_skills = set()
    
    for game in all_games_unfiltered:
        # Normalize categories (handle both string and list)
        cats = game.get('categories', [])
        if isinstance(cats, str):
            cats = [c.strip() for c in cats.split(',') if c.strip()]
        all_categories.update(c.strip() for c in cats if c)

        # Skills
        all_skills.update(s.strip() for s in game.get('skills', []) if s)

    # Get filtered and paginated games
    filtered_games = get_games_list(sort_mode=sort_mode, limit=None, filters=filters)
    total_games = len(filtered_games)
    total_pages = (total_games + per_page - 1) // per_page

    # Apply pagination
    start = (page - 1) * per_page
    end = start + per_page
    paginated_games = filtered_games[start:end]

    return render_template(
        'game_list.html',
        games=paginated_games,
        filters=filters,
        all_categories=sorted(all_categories),
        all_skills=sorted(all_skills),
        sort_mode=sort_mode,
        pagination={
            'page': page,
            'per_page': per_page,
            'total_pages': total_pages,
            'total_games': total_games
        },
        search_query=search_query
    )


@app.route('/play/<game_id>')
def play_game(game_id):
    game = load_game_metadata(game_id)
    
    if not game:
        return render_template('404.html'), 404
    
    template_file = game.get('template')
    if not template_file or not os.path.exists(template_file):
        return render_template('404.html'), 404

    # Tambahkan viewed +1 dan simpan
    current_views = game.get('viewed', 0)
    try:
        update_game_metadata(game_id, 'viewed', current_views + 1)
        game['viewed'] = current_views + 1
    except Exception as e:
        print(f"[ERROR] Gagal update viewed untuk {game_id}: {e}")

    # Render halaman game
    with open(template_file) as f:
        template_str = f.read()
    return render_template_string(template_str, game=game)



@app.route('/speak', methods=['POST'])
def speak():
    referer = request.headers.get('Referer', '')
    if not any(referer.startswith(allowed) for allowed in ALLOWED_REFERERS):
        abort(403, description="Forbidden: Invalid Referer")

    text = request.json.get('text', '').strip()
    if not text:
        return {'error': 'No text provided'}, 400

    # Batasi ke MAX_WORDS kata
    words = text.split()
    if len(words) > MAX_SPEAK_WORDS:
        words = words[:MAX_SPEAK_WORDS]
        text = ' '.join(words)

    tts = gTTS(text=text, lang='en')
    audio_fp = io.BytesIO()
    tts.write_to_fp(audio_fp)
    audio_fp.seek(0)
    return send_file(
        audio_fp,
        mimetype = 'audio/mpeg',
        as_attachment = False,
        download_name = 'speech.mp3'
    )



# Contoh route untuk menampilkan statistik
@app.route('/stats/game/<game_id>')
def show_game_stats(game_id):
    game = load_game_metadata(game_id)
    if not game:
        abort(404)
    
    stats = get_game_stats(game_id)
    return render_template('game_stats.html', game=game, stats=stats)



@app.route('/stats/overview')
def show_general_stats():
    stats = get_general_stats()
    
    # Format popular pages (ambil top 5)
    popular_pages = sorted(
        stats['popular_pages'].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:5]
    
    # Format traffic sources (top 5)
    traffic_sources = sorted(
        stats['traffic_sources'].items(),
        key=lambda x: x[1],
        reverse=True
    )[:5]
    
    return render_template('general_stats.html',
        stats=stats,
        popular_pages=popular_pages,
        traffic_sources=traffic_sources,
        busiest_day=stats['busiest_day'],
        now=datetime.now() 
    )



@app.route('/page/<page_name>')
def render_static_page(page_name):
    template_path = f'pages/{page_name}.html'
    full_path = os.path.join(app.template_folder or 'templates', template_path)
    
    if os.path.exists(full_path):
        return render_template(template_path)
    else:
        abort(404)


@app.template_filter('datetimeformat')
def datetimeformat(value, format='%Y-%m-%d %H:%M'):
    from datetime import datetime
    dt = datetime.fromisoformat(value)
    return dt.strftime(format)


if __name__ == '__main__':
    app.run(debug=True)