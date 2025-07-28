class WordChoiceGame extends BaseGame {
    constructor(config = {}) {
        // Maintain your exact element ID naming convention
        const defaultConfig = {
            questionImageElementId: 'question-image',
            backsoundAudioName: 'bright',
        };

        super({ ...defaultConfig, ...config });
        this.questionImageElement = document.getElementById(this.config.questionImageElementId);
    }

    displayQuestion(question) {
        // Clear previous state
        this.clearQuestionState();

        // Set question text
        this.domElements.questionElement.textContent = question.question;
        this.audioManager.speak(question.question);

        // Set question image if available
        if (question.metadata?.image) {
            this.questionImageElement.src = question.metadata.image;
            this.questionImageElement.alt = question.question;
            this.questionImageElement.classList.remove('d-none');
        } else {
            this.questionImageElement.classList.add('d-none');
        }

        // Create answer options
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.className = 'btn btn-outline-primary option-btn w-100 my-1 py-3 click-to-speak';
            optionElement.dataset.value = index;
            optionElement.textContent = option;
            this.domElements.optionsContainer.appendChild(optionElement);
        });
    }

    clearQuestionState() {
        // Clear options
        this.domElements.optionsContainer.innerHTML = '';
                
    }

    resetState() {
        // Clear options container
        while (this.domElements.optionsContainer.firstChild) {
            this.domElements.optionsContainer.removeChild(this.domElements.optionsContainer.firstChild);
        }        
    }

    async handleAnswer(answer) {
        const selectedButton = answer.target;
        if (!selectedButton.classList.contains('option-btn')) return;
        
        const answerValue = selectedButton.dataset.value;
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // Disable all options
        this.disableAllOptions();
        
        try {
            const checkedAnswer = await this.questionApi.checkAnswer(currentQuestion.id, parseInt(answerValue));
            this.disableAllOptions();
            
            if (checkedAnswer?.result?.is_correct) {
                this.handleCorrectAnswer(selectedButton, currentQuestion);
            } else {
                this.handleIncorrectAnswer(selectedButton, checkedAnswer);
            }
            
        } catch (error) {
            console.error('Error checking answer:', error);
            this.handleAnswerCheckError(selectedButton, currentQuestion, answerValue);
        }

        // go to text question
        setTimeout(() => this.nextQuestion(), 1500);
    }

    handleCorrectAnswer(selectedButton, currentQuestion) {
        // Visual feedback for correct answer
        selectedButton.classList.remove('btn-outline-primary');
        selectedButton.classList.add('btn-success');
        
        // Play sound and update score
        this.audioManager.playGameAudio('audio-true');
        this.score += currentQuestion.points || 1;
    }

    handleIncorrectAnswer(selectedButton, checkedAnswer) {
        // Visual feedback for incorrect answer
        selectedButton.classList.remove('btn-outline-primary');
        selectedButton.classList.add('btn-danger');
                
        // Play sound
        this.audioManager.playGameAudio('audio-false');
        
        // Highlight the correct answer
        this.highlightCorrectAnswer(checkedAnswer);
    }


    highlightCorrectAnswer(checkedAnswer) {
        document.querySelectorAll('.option-btn').forEach(button => {
            if (parseInt(button.dataset.value) === checkedAnswer?.result?.correct_answer) {
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-success');
            }
        });
    }

    handleAnswerCheckError(selectedButton, currentQuestion, answerValue) {
        // Fallback to client-side validation when API fails
        this.showError('Error checking answer. Using fallback validation.');
        
        const isCorrect = answerValue === currentQuestion.options[currentQuestion.correct_answer];
        
        if (isCorrect) {
            this.handleCorrectAnswer(selectedButton, currentQuestion);
        } else {
            this.handleIncorrectAnswer(selectedButton, currentQuestion);
        }
            }

    calculateFinalScore() {
        const maxScore = this.questions.reduce((sum, q) => sum + (q.points || 1), 0);
        return Math.round((this.score / maxScore) * 100);
    }

    initEventListeners() {
        super.initEventListeners();
        this.domElements.optionsContainer?.addEventListener('click', (e) => this.handleAnswer(e));
    }
}


// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new WordChoiceGame();
});