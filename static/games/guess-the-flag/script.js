class GuessTheFlagGame extends BaseGame {
    constructor() {
        super({
            questionElementId: 'countryName',
            questionContainerElementId: 'flagDisplay',
            optionsContainerElementId: 'optionsContainer',
            feedbackElementId: 'feedback',
            backsoundAudioName: 'fast-jump',
            randomQuestion: true // 
        });
    }

    displayQuestion(question) {
        // Display flag (using question.question as the flag emoji)
        this.domElements.questionContainer.innerHTML = `<div class="flag-emoji">${question.question}</div>`;
        this.domElements.questionElement.textContent = "Which country is this?";
        
        // Render options (using question.options array)
        this.renderOptions(question);
    }

    renderOptions(question) {
        this.domElements.optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-6';
            
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary w-100 py-3 mb-3 answer-btn click-to-speak';
            button.textContent = option;
            button.dataset.index = index;
            
            button.addEventListener('click', () => this.handleAnswer(index));
            col.appendChild(button);
            this.domElements.optionsContainer.appendChild(col);
        });
    }

    async handleAnswer(selectedIndex) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        try {
            this.showLoading();
            
            // Call API to check answer
            const checkAnswer = await this.questionApi.checkAnswer(
                currentQuestion.id, 
                selectedIndex
            );

            // Process API response
            const isCorrect     = checkAnswer.result?.is_correct ?? false;
            const correctAnswer = currentQuestion.options[checkAnswer.result?.correct_answer];

            // Update score based on API response
            if (isCorrect) {
                this.audioManager.playGameAudio('audio-true');
            } else {
                this.audioManager.playGameAudio('audio-false');
            }

            // Update question display with correct answer
            this.domElements.questionElement.textContent = correctAnswer;
            this.disableAllOptions();

        } catch (error) {
            console.error("Error checking answer:", error);
            this.showFeedback("Error checking answer. Please try again.", false);
        } finally {
            this.hideLoading();
            
            // Move to next question after delay
            setTimeout(() => {
                this.nextQuestion();
            }, 1500);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new GuessTheFlagGame();
    game.initGame();
});