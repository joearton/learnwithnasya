class Game extends BaseGame {
    constructor() {
        super({
            backsoundAudioName: 'silent-step',
        });
    }


    displayQuestion(question) {
        // Tampilkan container pertanyaan yang sebelumnya hidden
        this.domElements.questionContainer.style.display = 'block';
        
        // Bersihkan kontainer pertanyaan
        this.domElements.questionElement.innerHTML = `${question.question || 'No question text'}`;
        
        // Render opsi jawaban
        this.renderOptions(question);
        
        // Mainkan audio pertanyaan jika tersedia
        if (question.audioUrl) {
            this.audioManager.playGameAudio(question.audioUrl);
        } else {
            setTimeout(() => this.audioManager.talk(question.question), 1000);
        }
    }


    renderOptions(question) {
        this.domElements.optionsContainer.innerHTML = '';
        
        if (!question.options || !Array.isArray(question.options)) {
            this.domElements.optionsContainer.innerHTML = '<p>No options available</p>';
            return;
        }

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn btn btn-outline-primary btn-lg py-2 py-md-3 click-to-speak';
            button.textContent = option || `Option ${index + 1}`;
            button.dataset.index = index;
            button.onclick = () => this.handleAnswer(index);
            this.domElements.optionsContainer.appendChild(button);
        });
    }

    async handleAnswer(selectedIndex) {
        try {
            if (typeof selectedIndex !== 'number' || selectedIndex < 0) {
                throw new Error('Invalid answer selection');
            }
            
            const currentQuestion = this.questions[this.currentQuestionIndex];
            if (!currentQuestion) {
                throw new Error('Question not found');
            }

            const checkedAnswer = await this.questionApi.checkAnswer(currentQuestion.id, selectedIndex);
            this.disableAllOptions();
            
            if (checkedAnswer?.result?.is_correct) {
                this.handleCorrectAnswer(selectedIndex);
            } else {
                this.handleIncorrectAnswer(selectedIndex, checkedAnswer);
            }
            
        } catch (error) {
            console.error('Error checking answer:', error);
            this.showError('Error processing your answer');
        }

        setTimeout(() => this.nextQuestion(), 3000);
    }


    handleCorrectAnswer(selectedIndex) {
        const selectedBtn = document.querySelector(`.option-btn[data-index="${selectedIndex}"]`);
        if (selectedBtn) {
            selectedBtn.classList.replace('btn-outline-primary', 'btn-success');
        }
        
        this.showFeedback('Correct!', true);
        this.score += this.config.pointsPerQuestion;
        this.audioManager.playGameAudio('audio-true');
    }


    handleIncorrectAnswer(selectedIndex, checkedAnswer) {
        const correctIndex = checkedAnswer?.result?.correct_answer;
        const selectedBtn = document.querySelector(`.option-btn[data-index="${selectedIndex}"]`);
        const correctBtn = document.querySelector(`.option-btn[data-index="${correctIndex}"]`);

        if (selectedBtn) {
            selectedBtn.classList.replace('btn-outline-primary', 'btn-danger');
        }

        if (correctBtn) {
            correctBtn.classList.replace('btn-outline-primary', 'btn-success');
        }

        this.showFeedback('Oops! Try again.', false);
        this.audioManager.playGameAudio('audio-false');
    }


    calculateFinalScore() {
        // Custom scoring logic if needed
        return Math.min(Math.round((this.score / this.questions.length) * 100), 100);
    }

}


// Inisialisasi game
document.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new Game();
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.body.innerHTML = `
            <div class="container text-center py-5">
                <h1 class="text-danger">Game Error</h1>
                <p>${error.message}</p>
                <button class="btn btn-primary mt-3" onclick="location.reload()">
                    Reload Page
                </button>
            </div>
        `;
    }
});