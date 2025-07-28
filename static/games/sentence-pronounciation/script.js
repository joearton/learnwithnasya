class SpeakingGame extends BaseGame {
    constructor() {
        super({
            questionElementId: 'currentSentence',
            micButtonId: 'micButton',
            userSpeechElId: 'userSpeech',
            elements: {
                accuracyScore: 'accuracy-score',
                accuracyBar: 'accuracy-bar',
                correctWords: 'correct-words',
                incorrectWords: 'incorrect-words',
            }
        });

        this.filteredSentences = [];
        this.recognition = null;
        this.isSpeaking = false;

        this.setupSpeechRecognition();
    }


    initElements() {        
        // Pastikan element micButton diinisialisasi dengan benar
        this.micButton = document.getElementById(this.config.micButtonId);
        this.userSpeechEl = document.getElementById(this.config.userSpeechElId);
        this.userTextEl = this.userSpeechEl?.querySelector('.user-text');        
        if (!this.micButton) {
            console.error('Mic button not found with ID:', this.config.micButtonId);
        }

        // Inisialisasi elemen akurasi
        this.initAccuracyElements();
    }


    initAccuracyElements() {
        this.domElements.accuracyScore = document.getElementById(this.config.elements.accuracyScore);
        this.domElements.accuracyBar = document.getElementById(this.config.elements.accuracyBar);
        this.domElements.correctWords = document.getElementById(this.config.elements.correctWords);
        this.domElements.incorrectWords = document.getElementById(this.config.elements.incorrectWords);
    }


    initEventListeners() {
        this.initElements();
        super.initEventListeners();
        if (this.micButton) {
            this.micButton.addEventListener('click', () => {
                if (!this.isSpeaking) { 
                    this.toggleRecognition();
                }
            });
        } else {
            console.warn('Mic button not available for event listener');
        }
    }


    displayQuestion(question) {
        this.resetQuestionUI();
        
        this.domElements.questionElement.innerHTML = `
            <div class="sentence-text h4 fw-bold mb-2 click-to-speak">${question.question}</div>
            <div class="sentence-translation">${question.metadata.translation}</div>
        `;
        
        // Disable mic button selama text-to-speech
        this.toggleMicButton(false);
        this.isSpeaking = true;
        
        this.audioManager.talk(question.question).then(() => {
            this.isSpeaking = false;
            this.toggleMicButton(true); // Pastikan di-enable kembali
            console.log('Speech finished, mic button enabled');
        }).catch(err => {
            console.error('Error in text-to-speech:', err);
            this.isSpeaking = false;
            this.toggleMicButton(true); // Pastikan di-enable jika error
        });
    }

    resetRecognitionForRetry() {
        // Hentikan rekaman yang sedang berjalan
        if (this.recognition) {
            this.recognition.stop();
        }
        
        // Reset UI untuk percobaan ulang
        if (this.userSpeechEl) {
            this.userSpeechEl.classList.add('d-none');
        }
        
        // Reset mic button ke state awal
        this.resetMicButton();
        
        // Aktifkan kembali mic button untuk percobaan ulang
        this.toggleMicButton(true);
    }

    resetRecognition() {
        // Hentikan rekaman jika sedang aktif
        if (this.recognition) {
            this.recognition.stop();
        }
        
        // Reset UI lengkap
        this.resetQuestionUI();
        this.resetMicButton();
    }


    resetQuestionUI() {
        // Clear previous results
        if (this.userTextEl) this.userTextEl.textContent = '';
        if (this.userSpeechEl) this.userSpeechEl.classList.add('d-none');
        if (this.domElements.feedbackElement) this.clearFeedback();
        
        // Reset accuracy display
        if (this.domElements.accuracyScore) this.domElements.accuracyScore.textContent = '0';
        if (this.domElements.accuracyBar) {
            this.domElements.accuracyBar.style.width = '0%';
            this.domElements.accuracyBar.className = 'progress-bar';
        }
        if (this.domElements.correctWords) this.domElements.correctWords.innerHTML = '';
        if (this.domElements.incorrectWords) this.domElements.incorrectWords.innerHTML = '';
    }

    toggleMicButton(enabled) {
        if (!this.micButton) return;
        
        this.micButton.disabled = !enabled;
        if (enabled) {
            this.micButton.classList.remove('disabled');
            this.micButton.style.opacity = '1';
            this.micButton.style.cursor = 'pointer';
        } else {
            this.micButton.classList.add('disabled');
            this.micButton.style.opacity = '0.5';
            this.micButton.style.cursor = 'not-allowed';
        }
        console.log('Mic button enabled:', enabled);
    }

    async evaluateSpeech(spokenText) {
        const question = this.questions[this.currentQuestionIndex];
        try {
            const checkAnswer = await this.questionApi.checkAnswer(question.id, spokenText);
            
            // Update UI dengan hasil evaluasi
            this.updateAccuracyDisplay(checkAnswer.result);
            this.highlightDifferences(
                checkAnswer.result.differences.correct_words,
                checkAnswer.result.differences.incorrect_words
            );

            // Mainkan feedback audio
            this.audioManager.playGameAudio(checkAnswer.result.accuracy >= 70 ? 'audio-true' : 'audio-false');

            setTimeout(() => {
                this.resetRecognition();
                this.nextQuestion();
            }, 1500);
        } catch (error) {
            console.error("Error evaluating speech:", error);
            this.showFeedback("Error evaluating your speech. Please try again.", false);
            this.resetRecognitionForRetry();
        }
    }


    updateAccuracyDisplay(result) {
        if (!this.domElements.accuracyScore || !this.domElements.accuracyBar) return;
        
        this.domElements.accuracyScore.textContent = result.accuracy;
        this.domElements.accuracyBar.style.width = `${result.accuracy}%`;
        
        // Set appropriate color based on accuracy
        this.domElements.accuracyBar.className = `progress-bar ${
            result.accuracy >= 70 ? 'bg-success' : 
            result.accuracy >= 40 ? 'bg-warning' : 'bg-danger'
        }`;
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
        if (this.domElements.correctWords) {
            this.domElements.correctWords.innerHTML = correctHtml || 
                '<span class="text-muted">No perfect matches</span>';
        }
        
        if (this.domElements.incorrectWords) {
            this.domElements.incorrectWords.innerHTML = incorrectHtml || 
                '<span class="text-muted">Perfect match!</span>';
        }
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.showFeedback("Speech recognition not supported in this browser", false);
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 3;

        this.recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript.trim();
            if (this.userTextEl) this.userTextEl.textContent = spokenText;
            if (this.userSpeechEl) this.userSpeechEl.classList.remove('d-none');
            this.evaluateSpeech(spokenText);
        };

        this.recognition.onerror = (event) => {
            console.error("Recognition error:", event.error);
            this.showFeedback("Error: " + event.error, false);
            this.resetMicButton();
        };

        this.recognition.onend = () => {
            if (this.micButton && this.micButton.classList.contains('btn-warning')) {
                this.recognition.start();
            }
        };
    }

    toggleRecognition() {
        if (!this.micButton || this.isSpeaking) return;

        if (this.micButton.classList.contains('btn-danger')) {
            try {
                this.recognition.start();
                this.micButton.classList.replace('btn-danger', 'btn-warning');
                this.micButton.innerHTML = '<i class="fas fa-microphone-slash fa-2x"></i>';
                this.showFeedback("Listening... Speak now!", true);
            } catch (e) {
                console.error("Recognition error:", e);
                this.showFeedback("Error starting microphone", false);
            }
        } else {
            this.recognition.stop();
            this.resetMicButton();
        }
    }

    resetMicButton() {
        if (!this.micButton) return;
        
        this.micButton.classList.replace('btn-warning', 'btn-danger');
        this.micButton.innerHTML = '<i class="fas fa-microphone fa-2x"></i>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.game = new SpeakingGame();
});