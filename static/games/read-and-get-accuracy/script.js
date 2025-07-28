class SpeechRecognitionGame extends BaseGame {
    constructor(config) {
        // Merge with provided config
        super({
            randomQuestion: true,
            elements: {
                targetParagraph: 'target-paragraph',
                userSpeech: 'user-speech',
                startRecordingBtn: 'start-recording',
                stopRecordingBtn: 'stop-recording',
                accuracyScore: 'accuracy-score',
                accuracyBar: 'accuracy-bar',
                correctWords: 'correct-words',
                incorrectWords: 'incorrect-words',
            }
        });

        // Speech recognition variables
        this.recognition       = null;
        this.currentUserSpeech = '';

        // Additional DOM elements
        this.domElements.targetParagraph = document.getElementById(this.config.elements.targetParagraph);
        this.domElements.userSpeech = document.getElementById(this.config.elements.userSpeech);
        this.domElements.startRecordingBtn = document.getElementById(this.config.elements.startRecordingBtn);
        this.domElements.stopRecordingBtn = document.getElementById(this.config.elements.stopRecordingBtn);
        this.domElements.accuracyScore = document.getElementById(this.config.elements.accuracyScore);
        this.domElements.accuracyBar = document.getElementById(this.config.elements.accuracyBar);
        this.domElements.correctWords = document.getElementById(this.config.elements.correctWords);
        this.domElements.incorrectWords = document.getElementById(this.config.elements.incorrectWords);

        // Initialize speech recognition
        this.initSpeechRecognition();

        // Setup event listeners for this question
        this.setupQuestionEvents();

    }


    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech recognition is not supported in your browser. Try Chrome or Edge.");
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            this.currentUserSpeech = finalTranscript;
            this.domElements.userSpeech.innerHTML = finalTranscript + '<span style="color:#999;">' + interimTranscript + '</span>';
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            UIUtils.showFeedback(this.domElements.feedbackElement, "Speech recognition error: " + event.error, false);
        };
        
        return true;
    }


    setupQuestionEvents() {
        this.domElements.startRecordingBtn.onclick = () => {
            this.startRecording();
        };

        this.domElements.stopRecordingBtn.onclick = () => {
            this.stopRecording();
        };

        this.domElements.nextButton.onclick = () => {
            this.nextQuestion();
        };
    }


    displayQuestion(question) {
        this.domElements.targetParagraph.textContent = question.question;
        this.domElements.userSpeech.textContent = 'Click start speaking to get your speaking accuracy...';
        this.domElements.nextButton.classList.add('d-none');
        this.domElements.startRecordingBtn.classList.remove('d-none');
        this.domElements.stopRecordingBtn.classList.add('d-none');
    }

    nextQuestion() {
        super.nextQuestion();
    }


    resetUI() {
        this.domElements.nextButton.classList.add('d-none');
        this.domElements.startRecordingBtn.classList.add('d-none');
        this.domElements.stopRecordingBtn.classList.remove('d-none');
        this.domElements.userSpeech.textContent = 'Listening ... read the paragraph above';
        this.currentUserSpeech = '';

        // reset UI
        this.domElements.accuracyScore.textContent = 0;
        this.domElements.accuracyBar.style.width   = '0%';
        this.domElements.accuracyBar.className     = 'progress-bar bg-danger';
    }


    startRecording() {
        if (!this.recognition) {
            UIUtils.showFeedback(this.domElements.feedbackElement, "Speech recognition not available", false);
            return;
        }

        // reset currentUserspeech
        this.currentUserSpeech = '';

        try {
            this.resetUI();
            this.recognition.start();
        } catch (error) {
            console.error("Error starting recognition:", error);
            UIUtils.showFeedback(this.domElements.feedbackElement, "Error starting microphone", false);
        }
    }


    stopRecording() {
        if (!this.recognition) return;
        
        try {
            this.recognition.stop();
            this.domElements.startRecordingBtn.classList.remove('d-none');
            this.domElements.stopRecordingBtn.classList.add('d-none');
            
            this.evaluateSpeech();
        } catch (error) {
            console.error("Error stopping recognition:", error);
        }
    }

    
    async evaluateSpeech() {
        const originalText = this.domElements.targetParagraph.textContent;
        const userText = this.currentUserSpeech || '';

        // Calculate accuracy safely
        const question    = this.questions[this.currentQuestionIndex];
        const checkAnswer = await this.questionApi.checkAnswer(question.id, userText);

        // Update UI
        this.domElements.accuracyScore.textContent = checkAnswer.result.accuracy;
        this.domElements.accuracyBar.style.width   = `${checkAnswer.result.accuracy}%`;
        this.domElements.accuracyBar.className     = `progress-bar ${checkAnswer.result.accuracy >= 70 ? 'bg-success' : checkAnswer.result.accuracy >= 40 ? 'bg-warning' : 'bg-danger'}`;

        this.highlightDifferences(
            checkAnswer.result.differences.correct_words,
            checkAnswer.result.differences.incorrect_words
        );
        this.domElements.nextButton.classList.remove('d-none');

        // Play feedback sound
        if (this.audioManager) {
            this.audioManager.playGameAudio(checkAnswer.result.accuracy >= 70 ? 'audio-true' : 'audio-false');
        }

        // Reset for next
        this.currentUserSpeech = '';
    }


    highlightDifferences(correctWords, incorrectWords) {
        let correctHtml = '';
        let incorrectHtml = '';
        
        // Render correct words
        correctWords.forEach(word => {
            correctHtml += `<span class="text-success fw-bold me-1">${word}</span>`;
        });

        // Render incorrect words
        incorrectWords.forEach(word => {
            let displayText = '';
            if (word.missing) {
                displayText = `<span class="text-danger me-1"><del>${word.original}</del></span>`;
            } else if (word.extra) {
                displayText = `<span class="text-warning me-1">[+${word.user}]</span>`;
            } else {
                displayText = `
                    <span class="text-danger me-1">
                        <del>${word.original || ''}</del>
                        <ins>${word.user || ''}</ins>
                    </span>`;
            }
            incorrectHtml += displayText;
        });

        // Update DOM
        this.domElements.correctWords.innerHTML = correctHtml || 
            '<span class="text-muted">No perfect matches</span>';
        
        this.domElements.incorrectWords.innerHTML = incorrectHtml || 
            '<span class="text-muted">Perfect match!</span>';        
    }


}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const game = new SpeechRecognitionGame();
});