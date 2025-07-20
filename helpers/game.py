import os
import random
from helpers.metadata import load_game_metadata
from config import GAME_DIR


def get_games_list(sort_mode='name', limit=24, filters=None):
    games_dir = GAME_DIR
    games = []

    if not os.path.exists(games_dir):
        return games

    for game_id in os.listdir(games_dir):
        game_info = load_game_metadata(game_id)
        if not game_info:
            continue

        # Filtering berdasarkan metadata (tags, categories, skills, etc)
        if filters:
            matched = True
            for key, value in filters.items():
                if not value:
                    continue  # Skip filter yang kosong

                meta = game_info.get(key)
                if not meta:
                    matched = False
                    break

                # Jika metadata adalah list (tags, skills), cocokkan satu atau lebih item
                if isinstance(meta, list):
                    if isinstance(value, list):
                        # Setiap filter harus cocok sebagian dengan meta
                        if not any(v.lower() in (m.lower() for m in meta) for v in value):
                            matched = False
                            break
                    else:
                        if value.lower() not in [m.lower() for m in meta]:
                            matched = False
                            break

                # Jika metadata adalah string (misalnya categories, difficulty)
                elif isinstance(meta, str):
                    if isinstance(value, list):
                        if not any(v.lower() in meta.lower() for v in value):
                            matched = False
                            break
                    else:
                        if value.lower() not in meta.lower():
                            matched = False
                            break

                else:
                    matched = False
                    break

            if not matched:
                continue

        games.append(game_info)

    # Sort game list
    if sort_mode == 'random':
        random.shuffle(games)
    else:
        games.sort(key=lambda g: g.get('title', '').lower())

    return games[:limit]

