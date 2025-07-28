from flask import Blueprint, jsonify, request
from flask_login import current_user
from helpers.game import save_game_score
from helpers.question import QuizService, QuestionType


quiz_bp = Blueprint('quiz', __name__, url_prefix='/api/quiz')

# Initialize quiz_service without parameters, will be initialized per request
quiz_service = None


@quiz_bp.before_request
def before_request():
    """Initialize QuizService with game_id from request"""
    global quiz_service
    game_id = request.args.get('game_id') or request.headers.get('X-Game-ID')
    if not game_id:
        return jsonify({"error": "game_id is required"}), 400
    quiz_service = QuizService(game_id)


@quiz_bp.route('/questions', methods=['GET'])
def get_all_questions():
    """Endpoint untuk mendapatkan semua pertanyaan"""
    questions = quiz_service.get_all_questions()
    return jsonify({
        "game_id": quiz_service.game_id,
        "questions": questions
    })


@quiz_bp.route('/questions/<string:question_id>', methods=['GET'])
def get_question(question_id: str):
    """Endpoint untuk mendapatkan pertanyaan spesifik"""
    try:
        question = quiz_service.get_question(question_id)
        return jsonify({
            "game_id": quiz_service.game_id,
            "question": question
        })
    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@quiz_bp.route('/questions/<string:question_id>/check', methods=['POST'])
def check_answer(question_id: str):
    """Endpoint untuk memeriksa jawaban"""
    try:
        data = request.get_json()
        if not data or 'answer' not in data:
            return jsonify({"error": "Answer is required"}), 400
            
        result = quiz_service.check_answer(question_id, data['answer'])
        return jsonify({
            "game_id": quiz_service.game_id,
            "result": result
        })
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@quiz_bp.route('/stats', methods=['GET'])
def get_quiz_stats():
    """Endpoint untuk mendapatkan statistik quiz"""
    stats = {
        "game_id": quiz_service.game_id,
        "total_questions": quiz_service.get_question_count(),
        "question_types": {
            q_type.value: sum(1 for q in quiz_service.questions if q.type == q_type)
            for q_type in QuestionType
        }
    }
    return jsonify(stats)


@quiz_bp.route('/submit-score', methods=['POST'])
def submit_score():
    try:
        payload = request.get_json()
        if not payload or 'answers' not in payload:
            return jsonify({"error": "Missing 'answers' in payload"}), 400

        user_answers = payload["answers"]
        if not isinstance(user_answers, list):
            return jsonify({"error": "'answers' must be a list"}), 400

        result = quiz_service.calculate_score(user_answers)
        result['status'] = "success"

        return jsonify(result)

    except FileNotFoundError:
        return jsonify({"error": f"Questions for game_id not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
