class FillTheBlankGame extends BaseGame {
    constructor() {
        super({});
        this.initGame();
    }

    resetState() {
        super.resetGameState();
    }

    async displayQuestion(question) {
        // Set konten pertanyaan baru
        const questionText = question.text || question.question || '';
        this.domElements.questionElement.textContent = questionText.replace('___', '_______');
        
        // Kosongkan options container
        this.domElements.optionsContainer.innerHTML = '';
        
        // Buat tombol options
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary fade-effect option-btn text-start py-2 fs-5 click-to-speak';
            button.textContent = option;
            button.dataset.value = index;
            button.addEventListener('click', () => this.handleAnswer(index, question));
            this.domElements.optionsContainer.appendChild(button);
        });

    }

    async handleAnswer(selectedOption, question) {
        this.disableAllOptions();
        
        try {
            const checkedAnswer = await this.questionApi.checkAnswer(question.id, selectedOption);
            
            if (checkedAnswer.result?.is_correct) {
                this.handleCorrectAnswer(selectedOption);
            } else {
                this.handleIncorrectAnswer(selectedOption, checkedAnswer.result?.correct_answer);
            }
                        
            setTimeout(() => {
                this.nextQuestion();
            }, 1750);
        } catch (error) {
            console.error('Error checking answer:', error);
            this.showError('Error checking answer. Please try again.');
        }
    }

    handleCorrectAnswer(selectedOption) {
        this.audioManager.playGameAudio('audio-true');
        
        document.querySelectorAll('.option-btn').forEach(button => {
            if (button.dataset.value === selectedOption.toString()) {
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-success');
            }
        });
    }

    handleIncorrectAnswer(selectedOption, correctAnswer) {
        this.audioManager.playGameAudio('audio-false');
        
        document.querySelectorAll('.option-btn').forEach(button => {
            if (button.dataset.value === correctAnswer.toString()) {
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-success');
            }
            
            if (button.dataset.value === selectedOption.toString()) {
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-danger');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new FillTheBlankGame();
    window.game = game;
});