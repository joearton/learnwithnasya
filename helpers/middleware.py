from flask import request
from helpers.stats import record_visit
from config import TRACKED_ROUTES

def init_app(app):
    @app.after_request
    def after_request(response):
        for route in TRACKED_ROUTES:
            if request.path == route or ('<' in route and request.path.startswith(route.split('<')[0])):
                return record_visit(response)
        return response