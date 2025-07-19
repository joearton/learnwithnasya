import os
import io
from config import *
from gtts import gTTS
from helpers.metadata import load_game_metadata
from flask import (
    Flask,
    request,
    send_file,
    render_template,
    render_template_string
)


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



@app.route('/speak', methods=['POST'])
def speak():
    text = request.json.get('text')
    if not text:
        return {'error': 'No text provided'}, 400

    tts = gTTS(text=text, lang='en')
    audio_fp = io.BytesIO()
    tts.write_to_fp(audio_fp)
    audio_fp.seek(0)

    return send_file(
        audio_fp,
        mimetype='audio/mpeg',
        as_attachment=False,
        download_name='speech.mp3'
    )




if __name__ == '__main__':
    app.run(debug=True)