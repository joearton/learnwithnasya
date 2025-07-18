import os
from config import *
from flask import (
    Flask,
    render_template,
    send_from_directory,
    render_template_string
)
from helpers.metadata import load_game_metadata


app = Flask(__name__)


# Gabungkan dengan subfolder 'static/games'
app.config['GAMES_DIR'] = GAME_DIR


@app.route('/')
def index():
    games     = []
    games_dir = app.config['GAMES_DIR']
    if not os.path.exists(games_dir):
        return render_template('index.html', games = games)
    for game_id in os.listdir(games_dir):
        game_info = load_game_metadata(game_id)
        if game_info:
            games.append(game_info)            
    return render_template('index.html', games = games)



@app.route('/play/<game_id>')
def play_game(game_id):
    game = load_game_metadata(game_id)
    
    if not game:
        return render_template('404.html'), 404
    
    template_file = game.get('template')
    if not template_file or not os.path.exists(template_file):
        return render_template('404.html'), 404
            
    with open(template_file) as f:
        template_str = f.read()
    return render_template_string(template_str, game=game)


# Route untuk file static dalam folder game
@app.route('/games/<path:filename>')
def game_static(filename):
    return send_from_directory(app.config['GAMES_DIR'], filename)


if __name__ == '__main__':
    app.run(debug=True)