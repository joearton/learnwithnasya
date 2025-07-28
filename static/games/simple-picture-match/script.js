class PictureGame extends BaseGame {
    constructor(config) {
        super({            
            backsoundAudioName: 'bright',
        });

        // Game-specific elements
        this.questionImage = document.getElementById('question-image');
    }

    displayQuestion(question) {
        const gameId = window.location.pathname.split('/').pop();
        this.questionImage.innerHTML = `<img src="/static/games/${gameId}/images/${question.id}.png" alt="Question image" class="img-fluid rounded">`;
        this.domElements.questionElement.textContent = question.question;
        
        // Create options
        this.renderOptions(question);
    }

    renderOptions(question) {
        if (!this.domElements.optionsContainer) return;

        // Clear previous options
        this.domElements.optionsContainer.innerHTML = '';
        
        // Create new options
        question.options.forEach((option, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-6';
            
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-primary w-100 py-2 mb-2 answer-btn click-to-speak';
            btn.textContent = option;
            btn.onclick = () => this.handleAnswer(index);
            
            col.appendChild(btn);
            this.domElements.optionsContainer.appendChild(col);
        });
    }

    async handleAnswer(selectedIndex) {
        const question = this.questions[this.currentQuestionIndex];
        
        // Disable all buttons after selection
        this.disableAllOptions();

        try {
            // Check answer with API
            const checkAnswer = await this.questionApi.checkAnswer(question.id, selectedIndex);
            
            if (checkAnswer.result?.is_correct) {
                this.handleCorrectAnswer(checkAnswer, selectedIndex);
            } else {
                this.handleIncorrectAnswer(checkAnswer, selectedIndex);
            }
                                    
            // Move to next question after delay
            setTimeout(() => this.nextQuestion(), 2000);
        } catch (error) {
            this.showError(error.message);
        }
    }

    handleCorrectAnswer(checkAnswer, selectedIndex) {
        this.audioManager.playGameAudio('audio-true');
        this.questionImage.style.animation = "jump 0.5s";
    }

    handleIncorrectAnswer(checkAnswer, selectedIndex) {
        this.audioManager.playGameAudio('audio-false');
        this.questionImage.style.animation = "shake 0.5s";
    }

    disableAllOptions() {
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new PictureGame();
});