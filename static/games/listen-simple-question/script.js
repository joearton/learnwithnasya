class ListeningGame extends BaseGame {
    constructor(config) {
        super({
            listeningMode: true,
        });

    }


    async displayQuestion(question) {
        // Clear previous content
        this.clearQuestionDisplay();

        // Show listening indicator
        this.domElements.questionElement.textContent = "🔊 Listen and answer the question...";
        this.domElements.questionElement.classList.add('text-primary');

        // Speak the question number
        await this.audioManager.talk("Question number " + (this.currentQuestionIndex + 1) + " ...");

        // Render the visual options first
        this.renderOptions(question);

        await this.sleep(1000);

        // Animate and speak the question
        this.animateElement(this.domElements.questionElement);
        await this.audioManager.speak(question.question);

        // Speak and animate each option
        const optionButtons = this.domElements.optionsContainer.querySelectorAll('.answer-btn');

        for (let i = 0; i < question.options.length; i++) {
            const label = String.fromCharCode(65 + i); // A, B, C...
            const text = `${label}. . . . . ${question.options[i]}`;

            // Animate the button
            this.animateElement(optionButtons[i]);

            // Speak the option
            await this.audioManager.talk(text, 0.9, 0.9);
            await this.sleep(500);
        }
    }


    animateElement(element) {
        if (!element) return;

        element.classList.add('animate__animated', 'animate__pulse');

        const handleAnimationEnd = () => {
            element.classList.remove('animate__animated', 'animate__pulse');
            element.removeEventListener('animationend', handleAnimationEnd);
        };

        element.addEventListener('animationend', handleAnimationEnd);
    }


    // Helper sleep function
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    renderOptions(question) {
        // Clear previous options
        this.domElements.optionsContainer.innerHTML = '';
        
        // Create option buttons
        question.options.forEach((option, index) => {
            const col   = document.createElement('div');
            const label = String.fromCharCode(65 + index); // "A", "B", ...
            col.className = 'col-md-6';
            
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-primary w-100 py-3 mb-3 answer-btn';
            btn.innerHTML = `${label}`;
            btn.onclick = () => this.handleAnswer(index);
            
            col.appendChild(btn);
            this.domElements.optionsContainer.appendChild(col);
        });
    }

    async handleAnswer(selectedIndex) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        try {
            // Check answer using QuestionAPI
            const checkAnswer = await this.questionApi.checkAnswer(currentQuestion.id, selectedIndex);
            
            if (checkAnswer.result?.is_correct) {
                this.handleCorrectAnswer(checkAnswer, selectedIndex);
            } else {
                this.handleIncorrectAnswer(checkAnswer, selectedIndex);
            }
                                    
            // Move to next question after delay
            setTimeout(() => this.nextQuestion(), 1500);
            
        } catch (error) {
            console.error("Error checking answer:", error);
            this.showFeedback("Error checking answer. Please try again.", false);
        }
    }

    handleCorrectAnswer(answer, selectedIndex) {
        this.showFeedback("Correct! 🎉", true);
        this.audioManager.playGameAudio('audio-true');
        
        // Highlight correct answer
        this.highlightOption(selectedIndex, 'success');
    }

    handleIncorrectAnswer(answer, selectedIndex) {
        const correctAnswer = answer.result.correct_answer;
        this.audioManager.playGameAudio('audio-false');
        
        // Highlight incorrect and correct answers
        this.highlightOption(selectedIndex, 'danger');
        this.highlightOption(correctAnswer, 'success');
    }

    highlightOption(index, className) {
        const options = this.domElements.optionsContainer.querySelectorAll('.answer-btn');
        if (options[index]) {
            options[index].classList.remove('btn-outline-primary');
            options[index].classList.add(`btn-${className}`);
        }
    }

    clearQuestionDisplay() {
        this.domElements.optionsContainer.innerHTML = '';
    }

}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new ListeningGame();
});