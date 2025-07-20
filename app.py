import os
import io
from config import *
from gtts import gTTS
from helpers.metadata import load_game_metadata
from helpers.game import get_games_list
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


@app.route('/')
def index():
    sort_mode = request.args.get('sort', 'name')
    limit = 24

    filters = {
        'categories': request.args.get('category'),
        'tags': request.args.get('tag'),
        'skills': request.args.get('skill'),
        'author': request.args.get('author'),
    }

    # Hilangkan filter yang tidak diisi (opsional)
    filters = {k: v for k, v in filters.items() if v}

    games = get_games_list(sort_mode=sort_mode, limit=limit, filters=filters)
    return render_template('index.html', games=games)



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


@app.route('/page/<page_name>')
def render_static_page(page_name):
    template_path = f'pages/{page_name}.html'
    full_path = os.path.join(app.template_folder or 'templates', template_path)
    
    if os.path.exists(full_path):
        return render_template(template_path)
    else:
        abort(404)



if __name__ == '__main__':
    app.run(debug=True)