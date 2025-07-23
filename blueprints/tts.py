from flask import Blueprint, request, abort, send_file
from gtts import gTTS
import io
from config import ALLOWED_REFERERS, MAX_SPEAK_WORDS

tts_bp = Blueprint('tts', __name__)

@tts_bp.route('/speak', methods=['POST'])
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
