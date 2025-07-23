import os
from flask import Blueprint,abort, render_template
from helpers.game import get_games_list
from config import BASE_DIR


main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    games = get_games_list(limit=9)
    return render_template('index.html', games=games)


@main_bp.route('/page/<page_name>')
def view_static_page(page_name):
    template_path = f'pages/{page_name}.html'
    full_path = os.path.join(BASE_DIR, 'templates', template_path)
    
    if os.path.exists(full_path):
        return render_template(template_path)
    else:
        abort(404)