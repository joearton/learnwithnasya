import os
import random
from helpers.metadata import load_game_metadata
from config import GAME_DIR



def normalize_filter_value(value):
    """Normalize filter values for comparison"""
    if isinstance(value, str):
        return value.strip().lower()
    elif isinstance(value, list):
        return [v.strip().lower() for v in value if v.strip()]
    return value



def get_games_list(sort_mode='name', page=1, per_page=8, limit=None, filters=None):
    games_dir = GAME_DIR
    games = []

    if not os.path.exists(games_dir):
        return games

    # Normalize filters
    normalized_filters = {}
    if filters:
        for key, value in filters.items():
            if value:  # Skip empty filters
                normalized_filters[key] = normalize_filter_value(value)

    for game_id in os.listdir(games_dir):
        game_info = load_game_metadata(game_id)
        if not game_info:
            continue

        # Apply filters
        if normalized_filters:
            # Search filter
            if 'search' in normalized_filters:
                search_term = normalized_filters['search']
                search_fields = [
                    game_info.get('title', '').lower(),
                    game_info.get('description', '').lower(),
                    ' '.join(game_info.get('tags', [])).lower()
                ]
                if not any(search_term in field for field in search_fields):
                    continue

            # Other filters
            match = True
            for filter_key, norm_filter in normalized_filters.items():
                if filter_key == 'search':
                    continue
                
                game_value = game_info.get(filter_key, '')
                norm_game = normalize_filter_value(game_value)
                
                if not norm_game:
                    match = False
                    break
                
                if isinstance(norm_filter, list):
                    if isinstance(norm_game, list):
                        if not any(f in norm_game for f in norm_filter):
                            match = False
                            break
                    else:
                        if not any(f in norm_game for f in norm_filter):
                            match = False
                            break
                else:
                    if isinstance(norm_game, list):
                        if norm_filter not in norm_game:
                            match = False
                            break
                    else:
                        if norm_filter not in norm_game:
                            match = False
                            break

            if not match:
                continue

        games.append(game_info)

    # Sorting
    if sort_mode == 'random':
        random.shuffle(games)
    else:
        games.sort(key=lambda g: g.get('title', '').lower())

    # Handle pagination and limit
    if limit is not None:
        return games[:limit]
    else:
        start = (page - 1) * per_page
        end = start + per_page
        return games[start:end]