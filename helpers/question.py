import json
import re
import os
from enum import Enum
from typing import List, Union, Optional, Dict, Any
from pydantic import BaseModel, validator
from pathlib import Path
from config import GAME_DIR
from flask_login import current_user
from typing import List, Dict


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    ESSAY = "essay"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    SPEAKING = "speaking",


class BaseQuestion(BaseModel):
    id: str
    type: QuestionType
    question: str
    points: int = 1
    metadata: Dict[str, Any] = {}


class MultipleChoiceQuestion(BaseQuestion):
    type: QuestionType = QuestionType.MULTIPLE_CHOICE
    options: List[str]
    correct_answer: int 
    
    @validator('correct_answer')
    def validate_correct_answer(cls, v, values):
        if 'options' in values and v >= len(values['options']):
            raise ValueError("Correct answer index out of range")
        return v
    

class EssayQuestion(BaseQuestion):
    type: QuestionType = QuestionType.ESSAY
    expected_length: Optional[int] = None
    

class TrueFalseQuestion(BaseQuestion):
    type: QuestionType = QuestionType.TRUE_FALSE
    correct_answer: bool


class ShortAnswerQuestion(BaseQuestion):
    type: QuestionType = QuestionType.SHORT_ANSWER
    correct_answers: List[str]
    case_sensitive: bool = False
    

class SpeakingQuestion(BaseQuestion):
    type: QuestionType = QuestionType.SPEAKING
    correct_answer: str
    case_sensitive: bool = False


Question = Union[
    MultipleChoiceQuestion,
    EssayQuestion,
    TrueFalseQuestion,
    ShortAnswerQuestion,
    SpeakingQuestion
]


def question_factory(data: Dict) -> Question:
    question_type = data.get('type')
    
    if question_type == QuestionType.MULTIPLE_CHOICE:
        return MultipleChoiceQuestion(**data)
    elif question_type == QuestionType.ESSAY:
        return EssayQuestion(**data)
    elif question_type == QuestionType.TRUE_FALSE:
        return TrueFalseQuestion(**data)
    elif question_type == QuestionType.SHORT_ANSWER:
        return ShortAnswerQuestion(**data)
    elif question_type == QuestionType.SPEAKING:
        return SpeakingQuestion(**data)
    else:
        raise ValueError(f"Unknown question type: {question_type}")


class InvalidQuestionError(Exception):
    """Custom exception for invalid question data"""
    pass


def load_questions(game_id: str) -> List[Dict]:
    """
    Memuat dan memvalidasi pertanyaan dari file JSON berdasarkan game_id
    
    Args:
        game_id (str): ID game yang akan dimuat pertanyaannya
        
    Returns:
        List[Dict]: Daftar pertanyaan yang sudah divalidasi
        
    Raises:
        FileNotFoundError: Jika file tidak ditemukan
        json.JSONDecodeError: Jika format JSON tidak valid
        InvalidQuestionError: Jika struktur pertanyaan tidak valid
    """
    # Determine file path
    questions_path = os.path.join(GAME_DIR, game_id, "questions.json")
    
    # 1. Load file
    try:
        with open(questions_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"Questions file not found at {questions_path}")
    except json.JSONDecodeError as e:
        raise json.JSONDecodeError(f"Invalid JSON format in questions file: {str(e)}", e.doc, e.pos)
    
    # 2. Validate basic structure
    if not isinstance(raw_data, list):
        raise InvalidQuestionError("Questions data should be a list of question objects")
    
    # 3. Process and validate each question
    validated_questions = []
    errors = []
    
    for idx, question_data in enumerate(raw_data, start=1):
        try:
            # Validate using question factory
            question = question_factory(question_data)
            validated_questions.append(question.dict())
        except Exception as e:
            qid = question_data.get('id', f'index-{idx-1}')
            errors.append(f"Question {qid}: {str(e)}")
    
    if errors:
        error_msg = "Invalid questions found:\n" + "\n".join(errors)
        raise InvalidQuestionError(error_msg)
    
    return validated_questions


def save_questions(game_id: str, questions: List[Dict]) -> None:
    """
    Menyimpan pertanyaan ke file JSON berdasarkan game_id dengan validasi
    
    Args:
        game_id (str): ID game yang akan menyimpan pertanyaan
        questions (List[Dict]): Daftar pertanyaan
        
    Raises:
        InvalidQuestionError: Jika ada pertanyaan tidak valid
        IOError: Jika gagal menulis file
    """
    # Validate all questions first
    validated = []
    errors = []
    
    for idx, question_data in enumerate(questions, start=1):
        try:
            question = question_factory(question_data)
            validated.append(question.dict())
        except Exception as e:
            qid = question_data.get('id', f'index-{idx-1}')
            errors.append(f"Question {qid}: {str(e)}")
    
    if errors:
        error_msg = "Invalid questions found:\n" + "\n".join(errors)
        raise InvalidQuestionError(error_msg)
    
    # Determine file path and create directory if needed
    game_dir = os.path.join(GAME_DIR, game_id)
    os.makedirs(game_dir, exist_ok=True)
    questions_path = os.path.join(game_dir, "questions.json")
    
    # Write to file
    try:
        with open(questions_path, 'w', encoding='utf-8') as f:
            json.dump(validated, f, indent=2, ensure_ascii=False)
    except IOError as e:
        raise IOError(f"Failed to write questions to file: {str(e)}")



class SpeakingChecker:
    
    def check_speaking_accuracy(self, original: str, user_text: str):
        if not user_text.strip():
            return 0

        original_words = original.lower().split()
        user_words = user_text.lower().split()
        correct_count = 0
        max_length = max(len(original_words), len(user_words))

        for i in range(max_length):
            if i < len(original_words) and i < len(user_words):
                if original_words[i] == user_words[i]:
                    correct_count += 1

        accuracy = (correct_count / max_length) * 100
        return round(accuracy)


    def normalize_speaking_text(self, text: str) -> List[str]:
        text = text.lower()
        text = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]', '', text)
        return [w for w in text.split() if w]


    def get_speaking_differences(self, original: str, user_text: str) -> Dict[str, List]:
        original_words = self.normalize_speaking_text(original)
        user_words = self.normalize_speaking_text(user_text or '')
        
        aligned = []
        max_len = max(len(original_words), len(user_words))

        for i in range(max_len):
            orig = original_words[i] if i < len(original_words) else None
            user = user_words[i] if i < len(user_words) else None
            is_match = orig == user and orig is not None

            aligned.append({
                "original": orig,
                "user": user,
                "correct": is_match,
                "missing": orig is not None and user is None,
                "extra": orig is None and user is not None
            })

        correct_words   = [item["original"] for item in aligned if item["correct"]]
        incorrect_words = [
            {
                "original": item["original"],
                "user": item["user"],
                "missing": item["missing"],
                "extra": item["extra"]
            }
            for item in aligned if not item["correct"]
        ]

        return {
            "correct_words": correct_words,
            "incorrect_words": incorrect_words
        }



class QuizService(SpeakingChecker):
    
    def __init__(self, game_id: str):
        self.game_id = game_id
        raw_questions = load_questions(game_id)
        self.questions: List[Question] = [
            question_factory(q) for q in raw_questions
        ]
        self.question_dict = {q.id: q for q in self.questions}
    
    
    def get_all_questions(self) -> List[Dict[str, Any]]:
        """Return all questions in client-friendly format"""
        return [self._format_question_for_client(q) for q in self.questions]
    
    
    def get_question(self, question_id: str) -> Dict[str, Any]:
        """Get specific question by ID"""
        if question_id not in self.question_dict:
            raise ValueError("Question not found")
        return self._format_question_for_client(self.question_dict[question_id])
    
    
    def _format_question_for_client(self, question: Question) -> Dict[str, Any]:
        """Format question for client consumption (hides correct answers)"""
        base_data = {
            "id": question.id,
            "type": question.type,
            "question": question.question,
            "points": question.points,
            "metadata": question.metadata
        }
        
        if question.type == QuestionType.MULTIPLE_CHOICE:
            base_data["options"] = question.options
        elif question.type == QuestionType.ESSAY:
            base_data["expected_length"] = question.expected_length
        elif question.type == QuestionType.SHORT_ANSWER:
            base_data["case_sensitive"] = question.case_sensitive
        
        return base_data
 
   
    def check_answer(self, question_id: str, user_answer: Any) -> Dict[str, Any]:
        """Check user's answer against correct answer(s)"""
        if question_id not in self.question_dict:
            raise ValueError("Question not found")
        
        question = self.question_dict[question_id]
        result = {
            "question_id": question_id,
            "is_correct": False,
            "points_earned": 0,
            "correct_answer": "User is not logged in, login to get correct answer"
        }
        
        if current_user.is_authenticated:
            result['correct_answer'] = question.correct_answer            
        
        if question.type == QuestionType.MULTIPLE_CHOICE:
            result["is_correct"] = (user_answer == question.correct_answer)
        elif question.type == QuestionType.TRUE_FALSE:
            result["is_correct"] = (user_answer == question.correct_answer)
        elif question.type == QuestionType.SHORT_ANSWER:
            if question.case_sensitive:
                result["is_correct"] = (user_answer in question.correct_answers)
            else:
                result["is_correct"] = (user_answer.lower() in [a.lower() for a in question.correct_answers])
        elif question.type == QuestionType.SPEAKING:
            result["accuracy"]    = self.check_speaking_accuracy(question.question, user_answer)
            result["differences"] = self.get_speaking_differences(question.question, user_answer)
        elif question.type == QuestionType.ESSAY:
            # Essay questions can't be auto-checked
            result["needs_review"] = True
            result["is_correct"] = None
        
        if question.type == QuestionType.SPEAKING:
            result["points_earned"] = result["accuracy"] / 100
                                    
        else:
            if result["is_correct"]:
                result["points_earned"] = question.points
        
        return result
    

    def calculate_score(self, user_answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Menghitung skor berdasarkan jawaban pengguna, diskalakan ke rentang 0-100.

        Args:
            user_answers (List[Dict]): Daftar jawaban dari pengguna, 
                format: [{"question_id": "q1", "answer": ...}, ...]

        Returns:
            Dict[str, Any]: total_score (0-100), max_score, details
        """
        raw_score = 0
        max_score = 0
        results = []

        for user_entry in user_answers:
            question_id = user_entry.get("question_id")
            user_answer = user_entry.get("answer")

            if not question_id or question_id not in self.question_dict:
                results.append({
                    "question_id": question_id,
                    "error": "Invalid question ID"
                })
                continue

            question = self.question_dict[question_id]
            max_score += question.points
            result = self.check_answer(question_id, user_answer)

            raw_score += result.get("points_earned", 0)
            results.append(result)

        # Skor dalam rentang 0–100
        total_score = round((raw_score / max_score) * 100) if max_score > 0 else 0

        return {
            "total_score": total_score,
            "max_score": max_score,
            "raw_score": raw_score,
            "details": results
        }
            
        
    def get_question_count(self) -> int:
        return len(self.questions)