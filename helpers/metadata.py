import os
import json
import logging
from config import GAME_DIR


logger = logging.getLogger(__name__)


def load_game_metadata(game_id):
    game_path = os.path.join(GAME_DIR, game_id)

    if not os.path.isdir(game_path):
        return {}

    template_path = os.path.join(game_path, 'index.html')
    if not os.path.isfile(template_path):
        return {}

    # Default metadata
    game_info = {
        'id'        : game_id,
        'title'     : game_id.replace('-', ' ').title(),
        'thumbnail' : 'images/no-thumbnail.jpg',
        'path'      : game_path,
        'template'  : template_path,
        'style'     : f'games/{game_id}/style.css',
        'script'    : f'games/{game_id}/script.js'
    }

    # Cek thumbnail
    thumbnail_path = os.path.join(game_path, 'thumbnail.jpg')
    if os.path.isfile(thumbnail_path):
        game_info['thumbnail'] = f'games/{game_id}/thumbnail.jpg'

    # Cek info.json
    info_path = os.path.join(game_path, 'info.json')
    if os.path.isfile(info_path):
        try:
            with open(info_path, 'r', encoding='utf-8') as f:
                metadata = json.load(f)
                if isinstance(metadata, dict):
                    game_info.update(metadata)
        except (IOError, json.JSONDecodeError) as e:
            logger.warning(f'Gagal memuat info.json untuk game {game_id}: {e}')

    return game_info
