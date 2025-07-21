import os
import csv
from datetime import datetime, timedelta
from config import STATS_FIELDS, STATS_FILE
from flask import request
from collections import defaultdict



def init_stats_file():
    """Inisialisasi file CSV dengan header yang benar"""
    if not os.path.exists(STATS_FILE):
        with open(STATS_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=STATS_FIELDS)
            writer.writeheader()


def record_visit(response):
    """Mencatat kunjungan hanya jika belum ada kunjungan serupa dalam 3 jam terakhir"""

    init_stats_file()

    if (request.path == '/speak' or 
        request.path.startswith('/static/') or 
        request.method != 'GET'):
        return response

    now = datetime.now()
    new_visit = {
        'ip': request.remote_addr,
        'user_agent': request.headers.get('User-Agent', ''),
        'url': request.url,
        'path': request.path,
        'method': request.method,
        'referrer': request.headers.get('Referer', ''),
        'timestamp': now.isoformat()
    }

    # Cek apakah kunjungan serupa sudah ada dalam 3 jam terakhir
    try:
        with open(STATS_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    if (row['ip'] == new_visit['ip'] and
                        row['user_agent'] == new_visit['user_agent'] and
                        row['url'] == new_visit['url'] and
                        row['path'] == new_visit['path']):
                        
                        last_time = datetime.fromisoformat(row['timestamp'])
                        if now - last_time < timedelta(hours=3):
                            # Sudah tercatat < 3 jam lalu → tidak dicatat lagi
                            return response
                except Exception as e:
                    print(f"[parsing error] {e}")
                    continue
    except FileNotFoundError:
        pass  # Jika file belum ada, lanjut catat saja

    # ✅ Tulis kunjungan baru
    with open(STATS_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=STATS_FIELDS)
        writer.writerow(new_visit)

    return response


def get_visitor_stats():
    """Membaca data statistik dengan validasi header"""
    stats = []
    if os.path.exists(STATS_FILE):
        with open(STATS_FILE, 'r', encoding='utf-8') as f:
            # Cek apakah file kosong atau header valid
            try:
                reader = csv.DictReader(f)
                if reader.fieldnames and all(field in STATS_FIELDS for field in reader.fieldnames):
                    stats = list(reader)
            except csv.Error:
                pass
    return stats


def get_game_stats(game_id=None):
    """
    Menghasilkan statistik untuk game tertentu atau semua game
    """
    stats = get_visitor_stats()
    game_stats = {
        'total_visits': 0,
        'unique_visitors': set(),
        'visits_by_day': defaultdict(int),
        'referrers': defaultdict(int),
        'user_agents': defaultdict(int),
        'last_visited': None
    }

    for entry in stats:
        try:
            # Validasi entry
            if not all(field in entry for field in ['path', 'timestamp', 'ip']):
                continue

            # Filter game
            if game_id:
                if not entry['path'].endswith(f'/play/{game_id}'):
                    continue
            elif not entry['path'].startswith('/play/'):
                continue

            # Proses data
            game_stats['total_visits'] += 1
            game_stats['unique_visitors'].add(entry['ip'])
            
            visit_date = datetime.fromisoformat(entry['timestamp']).strftime('%Y-%m-%d')
            game_stats['visits_by_day'][visit_date] += 1
            
            if entry['referrer']:
                domain = entry['referrer'].split('/')[2] if '//' in entry['referrer'] else entry['referrer']
                game_stats['referrers'][domain] += 1
            
            ua = entry['user_agent'].split(' ')[0] if entry['user_agent'] else 'Unknown'
            game_stats['user_agents'][ua] += 1
            
            entry_time = datetime.fromisoformat(entry['timestamp'])
            if not game_stats['last_visited'] or entry_time > game_stats['last_visited']:
                game_stats['last_visited'] = entry['timestamp']

        except Exception as e:
            print(f"Error processing entry: {e}")
            continue

    game_stats['unique_visitor_count'] = len(game_stats['unique_visitors'])
    return game_stats



def get_general_stats():
    """Statistik umum dengan perbaikan typo 'visits'"""
    stats = get_visitor_stats()
    general_stats = {
        'total_page_views': len(stats),
        'unique_visitors': len(set(entry['ip'] for entry in stats if 'ip' in entry)),
        'popular_pages': defaultdict(int),
        'active_days': defaultdict(int),
        'busiest_day': {'date': None, 'visits': 0},  # Perbaikan typo 'visits'
        'traffic_sources': defaultdict(int)
    }

    daily_visits = defaultdict(int)
    
    for entry in stats:
        if 'path' in entry:
            general_stats['popular_pages'][entry['path']] += 1
        
        if 'timestamp' in entry:
            try:
                visit_date = datetime.fromisoformat(entry['timestamp']).strftime('%Y-%m-%d')
                daily_visits[visit_date] += 1
            except ValueError:
                continue
        
        if 'referrer' in entry:
            if entry['referrer']:
                try:
                    domain = entry['referrer'].split('/')[2] if '//' in entry['referrer'] else entry['referrer']
                    general_stats['traffic_sources'][domain] += 1
                except IndexError:
                    general_stats['traffic_sources']['direct'] += 1
            else:
                general_stats['traffic_sources']['direct'] += 1

    for date, count in daily_visits.items():
        if count > general_stats['busiest_day']['visits']:
            general_stats['busiest_day'] = {'date': date, 'visits': count}
        general_stats['active_days'][date] = count

    return general_stats


