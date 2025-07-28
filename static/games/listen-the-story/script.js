class VocabularyGame extends BaseGame {
    constructor() {
        super({
            playQuestionBtnId: 'play-question',
            listeningMode: true
        });

        // Additional DOM elements specific to this game
        this.playQuestionBtn = document.getElementById('play-question');
        this.playIcon = this.playQuestionBtn?.querySelector('i');
        
        // Initialize game-specific event listeners
        this.initGameSpecificListeners();
    }

    initGameSpecificListeners() {
        if (this.playQuestionBtn) {
            this.playQuestionBtn.addEventListener('click', () => {
                if (this.currentQuestionIndex < this.questions.length) {
                    this.playQuestionBtn.disabled = true;

                    // Add loading state to play button
                    this.playIcon.classList.remove('fa-volume-up');
                    this.playIcon.classList.add('fa-spinner', 'fa-spin');
                    
                    this.audioManager.talk("Question number " + (this.currentQuestionIndex + 1) + " ... ");
                    this.audioManager.talk(this.questions[this.currentQuestionIndex].metadata.text, 1.00, 1.00, true);

                    this.audioManager.talk("... ... ..." + this.questions[this.currentQuestionIndex].question, 1.75, 0.75);
                    
                    // Reset icon when speech ends
                    const checkEnd = setInterval(() => {
                        if (!window.speechSynthesis.speaking) {
                            this.playIcon.classList.remove('fa-spinner', 'fa-spin');
                            this.playIcon.classList.add('fa-volume-up');
                            clearInterval(checkEnd);
                            this.playQuestionBtn.disabled = false;
                        }
                    }, 100);
                }
            });
        }
    }
 
    displayQuestion(question) {
        // Hide question initially
        if (this.domElements.questionElement) {
            this.domElements.questionElement.style.visibility = 'hidden';
        }

        // Clear previous options
        if (this.domElements.optionsContainer) {
            this.domElements.optionsContainer.innerHTML = '';
        }

        // Show question after 1 second delay
        setTimeout(() => {
            if (this.domElements.questionElement) {
                this.domElements.questionElement.textContent = question.question;
                this.domElements.questionElement.style.visibility = 'visible';
            }
        }, 1000);

        // Create and display options with spacing
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'btn btn-outline-primary option-btn col-md-6 py-3 my-2 mx-2 click-to-speak';
            optionBtn.style.minHeight = '60px'; // Ensure consistent height
            optionBtn.style.margin = '10px 0'; // Add vertical spacing
            optionBtn.textContent = option;
            optionBtn.dataset.index = index;
            optionBtn.addEventListener('click', () => this.handleAnswer(index));
            this.domElements.optionsContainer.appendChild(optionBtn);
        });

        // Speak the question automatically after a short delay
        setTimeout(() => {
            this.audioManager.talk("Question number " + (this.currentQuestionIndex + 1) + " ... ");
            this.audioManager.talk(this.questions[this.currentQuestionIndex].metadata.text, 1.00, 1.00, true);
            this.audioManager.talk("... ... ..." + question.question, 1.00, 0.75);
            // Add loading state to play button during auto-play
            if (this.playIcon) {
                this.playQuestionBtn.disabled = true;
                this.playIcon.classList.remove('fa-volume-up');
                this.playIcon.classList.add('fa-spinner', 'fa-spin');
                // Reset icon when speech ends
                const checkEnd = setInterval(() => {
                    if (!window.speechSynthesis.speaking) {
                        this.playIcon.classList.remove('fa-spinner', 'fa-spin');
                        this.playIcon.classList.add('fa-volume-up');
                        clearInterval(checkEnd);
                        this.playQuestionBtn.disabled = false;
                    }
                }, 100);
            }
        }, 1000);
    }


    nextQuestion() {
        // Stop semua audio/speech yang sedang berjalan
        this.audioManager.stopSpeech();
        
        // Panggil implementasi parent class
        super.nextQuestion();
                
        // Reset state tombol play
        if (this.playIcon) {
            this.playIcon.classList.remove('fa-spinner', 'fa-spin');
            this.playIcon.classList.add('fa-volume-up');
        }
    }

    async handleAnswer(selectedIndex) {
        this.audioManager.stopSpeech();
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // Disable all options
        this.disableAllOptions();

        try {
            const checkAnswer = await this.questionApi.checkAnswer(currentQuestion.id, selectedIndex);
            
            if (checkAnswer.result?.is_correct) {
                this.handleCorrectAnswer(selectedIndex);
            } else {
                this.handleIncorrectAnswer(selectedIndex, checkAnswer.result?.correct_answer);
            }
            
            // Show next button
            if (this.domElements.nextButton) {
                this.domElements.nextButton.classList.remove('d-none');
            }
        } catch (error) {
            this.showError(error.message);
        }
    }


    handleCorrectAnswer(selectedIndex) {
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons[selectedIndex].classList.remove('btn-outline-primary');
        optionButtons[selectedIndex].classList.add('btn-success');
        
        this.audioManager.playGameAudio('audio-true');
    }


    handleIncorrectAnswer(selectedIndex, correctIndex) {
        const optionButtons = document.querySelectorAll('.option-btn');
        
        // Mark selected wrong answer
        optionButtons[selectedIndex].classList.remove('btn-outline-primary');
        optionButtons[selectedIndex].classList.add('btn-danger');
        
        // Mark correct answer
        optionButtons[correctIndex].classList.remove('btn-outline-primary');
        optionButtons[correctIndex].classList.add('btn-success');
        
        this.audioManager.playGameAudio('audio-false');
    }

}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new VocabularyGame();
});