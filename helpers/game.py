from datetime import datetime, timezone
import os
import random
from helpers.metadata import load_game_metadata
from config import GAME_DIR
import csv
from flask import request, jsonify
from config import DATA_DIR



def normalize_filter_value(value):
    """Normalize filter values for comparison"""
    if isinstance(value, str):
        return value.strip().lower()
    elif isinstance(value, list):
        return [v.strip().lower() for v in value if v.strip()]
    return value

    

def get_games_list(sort_mode='name', page=None, per_page=None, limit=None, filters=None):
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

    # Handle limit (if specified)
    if limit is not None:
        return games[:limit]
    
    return games    


def save_game_score(game_id, username, email, score):
    csv_file = os.path.join(DATA_DIR, f"score-board-{game_id}.csv")
    now_str = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')

    # Read existing scores
    scores = []
    if os.path.exists(csv_file):
        with open(csv_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                scores.append(row)

    # Add new score
    scores.append({
        'username'  : username,
        'email'     : email,
        'score'     : int(score),
        'date'      : now_str
    })

    # Sort by score descending, keep top 50
    scores = sorted(scores, key=lambda x: int(x['score']), reverse=True)[:50]

    # Write back to CSV
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['username', 'email', 'score', 'date'])
        writer.writeheader()
        for row in scores:
            writer.writerow(row)

    return scores


def mask_email(email):
    """Mask email by replacing part of the username and domain with asterisks."""
    if not email or '@' not in email:
        return email
    username, domain = email.split('@', 1)
    # Mask part of username
    if len(username) > 2:
        masked_user = username[0] + '***' + username[-1]
    else:
        masked_user = username[0] + '***'
    # Mask part of domain
    domain_parts = domain.split('.')
    masked_domain = domain_parts[0][0] + '***'
    if len(domain_parts) > 1:
        masked_domain += '.' + domain_parts[-1]
    return f"{masked_user}@{masked_domain}"


def get_game_scores(game_id):
    if not game_id:
        return []

    csv_file = os.path.join(DATA_DIR, f"score-board-{game_id}.csv")
    scores = []
    if os.path.exists(csv_file):
        with open(csv_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                row['email'] = mask_email(row.get('email', ''))
                scores.append(row)

    scores = sorted(scores, key=lambda x: int(x['score']), reverse=True)[:50]
    return scores