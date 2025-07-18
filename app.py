import os
from config import *
from flask import Flask, render_template, send_from_directory
from helpers.metadata import load_game_metadata


app = Flask(__name__)

# Gabungkan dengan subfolder 'static/games'
app.config['GAMES_DIR'] = GAME_DIR


@app.route('/')
def index():
    games     = []
    games_dir = app.config['GAMES_DIR']

    if not os.path.exists(games_dir):
        return render_template('index.html', games=games)

    for game_id in os.listdir(games_dir):
        game_info = load_game_metadata(game_id)
        if game_info:
            games.append(game_info)
            
    return render_template('index.html', games=games)



@app.route('/game/<game_id>')
def play_game(game_id):
    game_info = {}
    game_path = os.path.join(app.config['GAMES_DIR'], game_id)
    
    # Periksa apakah game ada
    if not os.path.isdir(game_path):
        return render_template('404.html'), 404
    
    # Periksa apakah file template ada
    template_file = os.path.join(game_path, 'index.html')
    if not os.path.isfile(template_file):
        return render_template('error.html',  message=f"Game is not found"), 404
    
        
    info_file = os.path.join(game_path, 'info.json')
    if os.path.isfile(info_file):
        game_info = load_game_metadata(game_id, app.config['GAMES_DIR'])
    
    return render_template('game_wrapper.html', game_info=game_info, game_template=f"games/{game_id}/index.html")


# Route untuk file static dalam folder game
@app.route('/games/<path:filename>')
def game_static(filename):
    return send_from_directory(app.config['GAMES_DIR'], filename)


if __name__ == '__main__':
    app.run(debug=True)