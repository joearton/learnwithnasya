import os
import json
import logging
from config import GAME_DIR, GAME_STAT_FILE


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
        'script'    : f'games/{game_id}/script.js',
        'viewed'    : get_game_viewer(game_id),
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



def update_game_metadata(game_id, key, value):
    game_path = os.path.join(GAME_DIR, game_id)
    info_path = os.path.join(game_path, 'info.json')

    # Pastikan folder game ada
    if not os.path.isdir(game_path):
        raise FileNotFoundError(f"Folder game {game_id} tidak ditemukan.")

    # Baca data lama (jika ada)
    metadata = {}
    if os.path.isfile(info_path):
        try:
            with open(info_path, 'r', encoding='utf-8') as f:
                metadata = json.load(f)
                if not isinstance(metadata, dict):
                    metadata = {}
        except (IOError, json.JSONDecodeError) as e:
            print(f"[WARNING] Gagal membaca info.json: {e}")
            metadata = {}

    # Perbarui field
    metadata[key] = value

    # Simpan kembali ke info.json
    try:
        with open(info_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)
    except IOError as e:
        raise IOError(f"Gagal menyimpan info.json untuk {game_id}: {e}")
    


def update_game_viewer(game_id):
    # Load existing stats
    stats = {}
    if os.path.isfile(GAME_STAT_FILE):
        try:
            with open(GAME_STAT_FILE, 'r', encoding='utf-8') as f:
                stats = json.load(f)
                if not isinstance(stats, dict):
                    stats = {}
        except (IOError, json.JSONDecodeError):
            stats = {}

    # Update viewer count
    stats[game_id] = stats.get(game_id, 0) + 1

    # Save back
    try:
        with open(GAME_STAT_FILE, 'w', encoding='utf-8') as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)
    except IOError as e:
        logger.warning(f"Gagal menyimpan game_visitor_counter.json: {e}")
        

def get_game_viewer(game_id):
    stats = {}
    if os.path.isfile(GAME_STAT_FILE):
        try:
            with open(GAME_STAT_FILE, 'r', encoding='utf-8') as f:
                stats = json.load(f)
                if not isinstance(stats, dict):
                    stats = {}
        except (IOError, json.JSONDecodeError):
            stats = {}
    return stats.get(game_id, 0)