import os
import secrets
from flask import Blueprint, render_template, request, abort, render_template_string, session
from helpers.metadata import load_game_metadata, update_game_viewer
from helpers.game import get_games_list, save_game_score
from config import BASE_DIR
from flask import jsonify
import csv
from datetime import datetime
from config import DATA_DIR
from flask_login import current_user, login_required

games_bp = Blueprint('games', __name__)


@games_bp.route('/game/list')
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


@games_bp.route('/game/start', methods=['POST'])
@login_required
def start_game():
    data = request.get_json()
    game_id = data.get('game_id')
    if not game_id:
        return jsonify({'error': 'Missing game_id'}), 400

    # Generate random token
    token = secrets.token_urlsafe(16)
    # Simpan token di session user
    session['game_token'] = token
    session['game_id'] = game_id
    session['game_start_time'] = datetime.utcnow().isoformat()

    return jsonify({'token': token})



@games_bp.route('/play/<game_id>')
def play_game(game_id):
    game = load_game_metadata(game_id)
    
    if not game:
        return render_template('404.html'), 404
    
    template_file = game.get('template')
    if not template_file or not os.path.exists(template_file):
        return render_template('404.html'), 404

    # Tambahkan viewed +1 dan simpan
    try:
        update_game_viewer(game_id)
    except Exception as e:
        print(f"[ERROR] Gagal update viewed untuk {game_id}: {e}")

    # Render halaman game
    with open(template_file) as f:
        template_str = f.read()
    return render_template_string(template_str, game=game)


@games_bp.route('/game/score', methods=['POST'])
@login_required
def record_game_score():
    if not request.is_json:
        abort(403)  # Forbid direct access (non-JSON requests)

    def reset_session():
        session.pop('game_token', None)
        session.pop('game_id', None)
        session.pop('game_start_time', None)

    data     = request.get_json()
    username = getattr(current_user, 'username', None)
    email    = getattr(current_user, 'email', None)
    game_id  = data.get('game_id')
    token    = data.get('token')
    score    = data.get('score', 0)

    if token != session.get('game_token') or game_id != session.get('game_id'):
        reset_session()
        return jsonify({'error': 'Invalid token'}), 403

    if not all([game_id, username, email, score]):
        reset_session()
        return jsonify({'error': 'Missing required fields'}), 400

    top_scores = save_game_score(game_id, username, email, score)
    reset_session()
    
    return jsonify({'success': True, 'top_scores': top_scores})
    




