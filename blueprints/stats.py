from flask import Blueprint, request, abort, render_template
from datetime import datetime
from helpers.stats import get_game_stats, get_general_stats
from helpers.metadata import load_game_metadata, update_game_metadata


stats_bp = Blueprint('stats', __name__)


@stats_bp.route('/stats/game/<game_id>')
def show_game_stats(game_id):
    game = load_game_metadata(game_id)
    if not game:
        abort(404)
    
    stats = get_game_stats(game_id)
    return render_template('game_stats.html', game=game, stats=stats)



@stats_bp.route('/stats/overview')
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