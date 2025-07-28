class ProgressTracker {
    constructor({ progressBarElementId, currentQuestionId, totalQuestionsId }) {
        this.progressBar = document.getElementById(progressBarElementId);
        this.currentQuestionDisplay = document.getElementById(currentQuestionId);
        this.totalQuestionsDisplay = document.getElementById(totalQuestionsId);
        this.currentIndex = 0;
        this.total = 0;
    }

    setTotal(total) {
        this.total = total;
        if (this.totalQuestionsDisplay) {
            this.totalQuestionsDisplay.textContent = total;
        }
        this.update();
    }

    next() {
        if (this.currentIndex < this.total) {
            this.currentIndex++;
            this.update();
        }
    }

    reset() {
        this.currentIndex = 0;
        this.update();
    }

    update() {
        // Update progress bar
        if (this.progressBar && this.total > 0) {
            const percentage = (this.currentIndex / this.total) * 100;
            this.progressBar.style.width = `${percentage}%`;
        }

        // Update display text
        if (this.currentQuestionDisplay) {
            this.currentQuestionDisplay.textContent = this.currentIndex + 1;
        }
    }

    setCurrent(index) {
        if (index >= 0 && index < this.total) {
            this.currentIndex = index;
            this.update();
        }
    }
}


class Timer {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.startTime = null;
        this.interval = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning || !this.element) return;
        
        this.startTime = new Date();
        this.isRunning = true;
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    stop() {
        if (!this.isRunning) return;
        
        clearInterval(this.interval);
        this.isRunning = false;
    }

    reset() {
        this.stop();
        if (this.element) {
            this.element.textContent = "00:00:00";
        }
        this.startTime = null;
    }

    update() {
        if (!this.element || !this.startTime) return;
        
        const currentTime = new Date();
        const elapsed = Math.floor((currentTime - this.startTime) / 1000);
        
        // Format HH:MM:SS
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        this.element.textContent = 
            `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
    }

    getTimeString() {
        if (!this.startTime) return "00:00:00";
        const currentTime = new Date();
        const elapsed = Math.floor((currentTime - this.startTime) / 1000);
        
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        return `${hours.toString().padStart(2, '0')}:` +
               `${minutes.toString().padStart(2, '0')}:` +
               `${seconds.toString().padStart(2, '0')}`;
    }
}


class QuestionAPI {

    constructor() {
        this.baseUrl = baseUrl;
        this.gameId = window.location.pathname.split('/').pop();
        this.userAnswers = []; 
    }
    
    async _fetchWithGameId(url, options = {}) {
        if (!this.gameId) {
            throw new Error('Game ID is not set');
        }

        const headers = {
            'Content-Type': 'application/json',
            'X-Game-ID': this.gameId,
            ...options.headers
        };

        const response = await fetch(`${this.baseUrl}${url}?game_id=${this.gameId}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || error.error || 'Request failed');
        }

        return response.json();
    }

    async getAllQuestions() {
        return this._fetchWithGameId('/questions');
    }

    async getQuestion(questionId) {
        return this._fetchWithGameId(`/questions/${questionId}`);
    }

    async checkAnswer(questionId, answer) {
        const result = await this._fetchWithGameId(`/questions/${questionId}/check`, {
            method: 'POST',
            body: JSON.stringify({ answer })
        });

        // save all user answer
        this.userAnswers.push({
            question_id: questionId,
            answer: answer,
        });

        return result;
    }


    async getQuizStats() {
        return this._fetchWithGameId('/stats');
    }


    getUserAnswers() {
        return this.userAnswers;
    }

    clearUserAnswers() {
        this.userAnswers = [];
    }
    
    
    async submitScore() {
        const userAnswers = this.getUserAnswers();

        return this._fetchWithGameId(`/submit-score`, {
            method: 'POST',
            body: JSON.stringify({ answers: userAnswers })
        });
    }

}


class UIUtils {
    static showFinalResults(finalScore, timeString, showDetails = false) {
        // Extract score details from finalScore object
        const total_score = finalScore?.total_score || 0;
        const raw_score = finalScore?.raw_score || 0;
        const max_score = finalScore?.max_score || 100;
        const details = finalScore?.details || [];

        // Detail skor per soal
        let detailTable = '';
        if (showDetails || details.length > 0) {
            const detailRows = details.map((item, index) => {
                const isCorrect = item.correct || item.is_correct;
                const icon = isCorrect ? '✅' : '❌';
                const points = item.points_earned ?? (isCorrect ? 1 : 0);
                const explanation = item.explanation ? `<small class="text-muted d-block">${item.explanation}</small>` : '';

                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.question_id || '-'}</td>
                        <td>${icon}</td>
                        <td>${points}</td>
                        <td>${explanation}</td>
                    </tr>
                `;
            }).join('');

            detailTable = `
                <div class="table-responsive mt-4" id="detailTableContainer">
                    <table class="table table-bordered table-sm text-start">
                        <thead class="table-light">
                            <tr>
                                <th>#</th>
                                <th>Question ID</th>
                                <th>Correct</th>
                                <th>Points</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${detailRows}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // Hapus modal lama jika ada
        const existing = document.getElementById('finalResultModal');
        if (existing) existing.remove();

        // Buat modal
        const modalHTML = `
            <div class="modal fade" id="finalResultModal" tabindex="-1" aria-labelledby="finalResultLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content text-center p-4">
                <div class="modal-body">
                    <div class="display-4 text-primary mb-3">🎉</div>
                    <h3 class="mb-3">Your Final Score</h3>
                    <div class="display-3 fw-bold text-primary my-3">${total_score}/100</div>
                    <p class="fs-5 mb-2 text-muted">Raw score: ${raw_score}/${max_score}</p>
                    <p class="fs-5 mb-4">Time taken: ${timeString}</p>

                    ${showDetails ? detailTable : `
                        <button class="btn btn-outline-secondary mb-4" id="toggleDetailBtn">Show Details</button>
                        <div id="detailTableContainer" style="display: none;">${detailTable}</div>
                    `}

                    <button class="btn btn-primary btn-lg mt-2" onclick="location.reload()">
                        <i class="fas fa-redo me-2"></i>Play Again
                    </button>
                </div>
                </div>
            </div>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = modalHTML.trim();
        const modalElement = wrapper.firstChild;
        document.body.appendChild(modalElement);

        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Event listener untuk toggle detail
        setTimeout(() => {
            const toggleBtn = document.getElementById('toggleDetailBtn');
            const tableContainer = document.getElementById('detailTableContainer');

            if (toggleBtn && tableContainer) {
                toggleBtn.addEventListener('click', () => {
                    const isVisible = tableContainer.style.display === 'block';
                    tableContainer.style.display = isVisible ? 'none' : 'block';
                    toggleBtn.textContent = isVisible ? 'Show Details' : 'Hide Details';
                });
            }
        }, 500);
    }
    
    
    static toggleLoading(loadingElement, show) {
        if (!loadingElement) return;
        
        if (show) {
            loadingElement.classList.remove('d-none');
        } else {
            loadingElement.classList.add('d-none');
        }
    }

    static showError(feedbackElement, message) {
        if (!feedbackElement) return;
        
        feedbackElement.textContent = message;
        feedbackElement.className = 'text-danger fw-bold';
    }
    
    static showFeedback(feedbackElement, message, isSuccess = true) {
        if (!feedbackElement) return;
        feedbackElement.textContent = message;
        feedbackElement.className = isSuccess ? 'alert alert-success fw-bold' : 'alert alert-danger fw-bold';
    }

    static clearFeedback(feedbackElement) {
        if (!feedbackElement) return;
        feedbackElement.textContent = '';
        feedbackElement.className = '';
    }


    static createRetryButton() {
        const button = document.createElement('button');
        button.className = 'btn btn-primary mt-3';
        button.textContent = 'Retry';
        button.onclick = () => location.reload();
        return button;
    }
}


class AudioManager {
    constructor(config = {}) {
        // Default configuration
        this.config = {
            speechAudioId       : 'audio-speech',
            backsoundAudioId    : 'audio-backsound',
            clickToSpeakClass   : 'click-to-speak',
            backsoundAudioName  : null,
            listeningMode       : false,
            speakerIconHTML     : '<i class="fa fa-play-circle"></i>',
            speechSettings      : {
                lang    : 'en-GB',
                pitch   : 1.0,
                rate    : 0.7,
                volume  : 1.0,
                voice   : null
            },
            ...config
        };

        // Audio elements
        this.speechAudio = document.getElementById(this.config.speechAudioId);
        this.backsoundAudio = document.getElementById(this.config.backsoundAudioId);
        this.currentSpeech = null;
        this.isMuted = this.loadMuteState();

        // Load saved settings
        this.loadSettings();
        
        // Initialize
        this.initObserver();
        this.setupClickToSpeak();
        this.setupSpeechModal();
    }


    // Load saved settings from localStorage
    loadSettings() {
        const savedSettings = localStorage.getItem('speechSettings');
        if (savedSettings) {
            this.config.speechSettings = {
                ...this.config.speechSettings,
                ...JSON.parse(savedSettings)
            };
        }
    }


    playBacksound(startSec = 0) {
        // Jika belum ada elemen audio, buat
        if (!this.backsoundAudio) {
            this.backsoundAudio = new Audio();
        }

        // Set sumber audio
        this.backsoundAudio.src  = "/static/audio/sound-" + this.config.backsoundAudioName + '.mp3';
        this.backsoundAudio.loop = true; 
        this.backsoundAudio.volume = 0.3; 
        
        // Tunggu audio siap sebelum set currentTime
        this.backsoundAudio.addEventListener('canplay', () => {
            this.backsoundAudio.currentTime = startSec;
            this.backsoundAudio.play();
        }, { once: true }); // hanya satu kali

        // Load audio (memicu event 'canplay')
        this.backsoundAudio.load();
    }

    
    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('speechSettings', JSON.stringify(this.config.speechSettings));
    }


    getCurrentModalSettings() {
        return {
            lang: document.getElementById('languageSelect').value,
            pitch: parseFloat(document.getElementById('pitchRange').value),
            rate: parseFloat(document.getElementById('rateRange').value),
            volume: parseFloat(document.getElementById('volumeRange').value),
            voice: document.getElementById('voiceSelect').value || null
        };
    } 


    // Setup speech configuration modal
    setupSpeechModal() {
        const speechBtn = document.getElementById('toolbox-speech');
        if (!speechBtn) return;

        speechBtn.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('speechConfigModal'));
            this.populateVoiceList().then(() => {
                this.updateModalValues();
                modal.show();
            });
        });

        // Range input events
        document.getElementById('pitchRange').addEventListener('input', (e) => {
            document.getElementById('pitchValue').textContent = e.target.value;
        });

        document.getElementById('rateRange').addEventListener('input', (e) => {
            document.getElementById('rateValue').textContent = e.target.value;
        });

        document.getElementById('volumeRange').addEventListener('input', (e) => {
            document.getElementById('volumeValue').textContent = e.target.value;
        });

        // Test button
        document.getElementById('testSpeechBtn').addEventListener('click', () => {
            const currentSettings = this.getCurrentModalSettings();
            const utterance = new SpeechSynthesisUtterance("This is a test of the current speech settings");
            
            utterance.lang = currentSettings.lang;
            utterance.pitch = currentSettings.pitch;
            utterance.rate = currentSettings.rate;
            utterance.volume = currentSettings.volume;
            
            if (currentSettings.voice) {
                const voices = speechSynthesis.getVoices();
                const selectedVoice = voices.find(v => v.name === currentSettings.voice);
                if (selectedVoice) utterance.voice = selectedVoice;
            }
            
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
            window.speechSynthesis.speak(utterance);
        });

        // Save button
        document.getElementById('saveSpeechSettings').addEventListener('click', () => {
            this.config.speechSettings = this.getCurrentModalSettings();
            this.saveSettings();
            bootstrap.Modal.getInstance(document.getElementById('speechConfigModal')).hide();
        });
    }

    // Populate voice list dropdown
    populateVoiceList() {
        return new Promise((resolve) => {
            const voiceSelect = document.getElementById('voiceSelect');
            voiceSelect.innerHTML = '<option value="">Default Voice</option>';

            if (!('speechSynthesis' in window)) {
                voiceSelect.innerHTML = '<option value="">Speech synthesis not supported</option>';
                resolve();
                return;
            }

            // Some browsers need this to populate voices
            window.speechSynthesis.onvoiceschanged = () => {
                const voices = window.speechSynthesis.getVoices();
                voices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' - Default' : ''}`;
                    voiceSelect.appendChild(option);
                });
                resolve();
            };

            // Try to get voices immediately
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                voices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' - Default' : ''}`;
                    voiceSelect.appendChild(option);
                });
                resolve();
            } else {
                // If voices aren't loaded yet, wait for onvoiceschanged
                window.speechSynthesis.getVoices();
            }
        });
    }

    // Update modal with current settings
    updateModalValues() {
        const settings = this.config.speechSettings;
        document.getElementById('languageSelect').value = settings.lang;
        document.getElementById('pitchRange').value = settings.pitch;
        document.getElementById('pitchValue').textContent = settings.pitch;
        document.getElementById('rateRange').value = settings.rate;
        document.getElementById('rateValue').textContent = settings.rate;
        document.getElementById('volumeRange').value = settings.volume;
        document.getElementById('volumeValue').textContent = settings.volume;

        if (settings.voice) {
            document.getElementById('voiceSelect').value = settings.voice;
        }
    }

    // Initialize MutationObserver for dynamic content
    initObserver() {
        this.observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Only element nodes
                        if (node.classList.contains(this.config.clickToSpeakClass) || 
                            node.querySelector(`.${this.config.clickToSpeakClass}`)) {
                            this.setupClickToSpeak(node);
                        }
                    }
                });
            });
        });

        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    // Play any game audio by ID
    playGameAudio(audioId) {
        if (this.checkMuted()) return;
        const audio = document.getElementById(audioId);

        if (!audio) {
            console.warn(`Audio with ID "${audioId}" not found.`);
            return;
        }

        // Restart if already playing
        if (!audio.paused) {
            audio.currentTime = 0;
        }

        audio.play().catch((err) => {
            console.error(`Failed to play audio "${audioId}":`, err);
        });
    }

    stopSpeech() {
        if (this.speechAudio) {
            this.speechAudio.pause();
            this.speechAudio.currentTime = 0;
        }
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    }

    loadMuteState() {
        return localStorage.getItem('gameAudioMuted') === 'true';
    }

    saveMuteState(isMuted) {
        localStorage.setItem('gameAudioMuted', isMuted.toString());
        this.isMuted = isMuted;
    }

    toggleMute() {
        const newMuteState = !this.isMuted;
        this.saveMuteState(newMuteState);
        this.muteAllAudio(newMuteState);
        return newMuteState;
    }

    checkMuted() {
        if (this.isMuted) {
            return true;
        }
        return false;
    }

    // Text-to-Speech with server-side audio generation
    async speak(text) {
        if (this.checkMuted()) return;

        this.stopSpeech();

        return new Promise(async (resolve) => {
            try {
                const response = await fetch('/speak', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });

                if (!response.ok) {
                    throw new Error('Failed to generate speech');
                }

                const blob = await response.blob();
                const audioUrl = URL.createObjectURL(blob);

                this.speechAudio.src = audioUrl;
                this.speechAudio.style.display = 'block';

                // Tunggu sampai audio selesai diputar
                this.speechAudio.onended = () => resolve();
                this.speechAudio.onerror = () => resolve(); // Hindari macet jika error
                this.currentSpeech = this.speechAudio.play();
            } catch (error) {
                console.error('Speech generation failed:', error);
                // Fallback ke browser TTS
                await this.talk(text); // pastikan talk juga bisa di-await
                resolve(); // tetap resolve agar tidak menggantung
            }
        });
    }


     
    getRandomEnGbVoice() {
        const allVoices = speechSynthesis.getVoices();

        // Filter hanya yang en-GB dan bukan default
        const enGbVoices = allVoices.filter(
            voice => voice.lang === 'en-GB' && !voice.default
        );

        if (enGbVoices.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * enGbVoices.length);
        return enGbVoices[randomIndex];
    }


    getDefaultVoice() {
        const voices = speechSynthesis.getVoices();
        return voices.find(voice => voice.default) || null;
    }


    // Browser-native Text-to-Speech
    talk(text, pitch = null, rate = null, random_voice = false) {
        return new Promise((resolve) => {
            if (this.checkMuted() || !text) {
                return resolve(); // Tetap resolve agar tidak menggantung
            }

            text = text.replace("____", " ... blank ... ");

            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                const settings = this.config.speechSettings;

                utterance.lang = settings.lang;
                utterance.pitch = pitch ?? settings.pitch;
                utterance.rate = rate ?? settings.rate;
                utterance.volume = settings.volume;

                // set voice
                if (this.config.listeningMode) {
                    utterance.voice = random_voice
                        ? this.getRandomEnGbVoice()
                        : this.getDefaultVoice();
                } else if (settings.voice) {
                    const voices = speechSynthesis.getVoices();
                    const selectedVoice = voices.find(v => v.name === settings.voice);
                    if (selectedVoice) {
                        utterance.voice = selectedVoice;
                    }
                }

                // resolve after speaking
                utterance.onend = () => resolve();
                utterance.onerror = () => resolve(); // avoid hanging if error
                speechSynthesis.speak(utterance);
            } else {
                this.speak(text); // fallback if not supported
                console.warn("Text-to-speech not supported");
                resolve(); // tetap resolve agar tidak menggantung
            }
        });
    }

    // Setup click-to-speak functionality
    setupClickToSpeak(rootElement = document) {
        const elements = rootElement.querySelectorAll(`.${this.config.clickToSpeakClass}`);

        elements.forEach(el => {
            if (this.checkMuted()) return;
            if (!el.querySelector('.speaker-icon')) {
                el.style.position = 'relative';

                const icon = document.createElement('div');
                icon.className = 'speaker-icon';
                icon.title = 'Click to speak';
                icon.innerHTML = this.config.speakerIconHTML;
                icon.addEventListener('click', (e) => {
                    const textContent = el.textContent.trim();
                    const cleanedText = textContent.replace(/[^a-zA-Z0-9.,\s_]/g, '');
                    e.stopPropagation();
                    this.talk(cleanedText);
                });

                el.appendChild(icon);
            }
        });
    }

    // Clean up
    destroy() {
        this.observer.disconnect();
        this.stopSpeech();
    }
}


class BaseGame {

    constructor(config) {
        // Configuration
        this.config = {
            startScreenId               : 'start-screen',
            startGameBtnId              : 'start-game-btn',
            gameScreenId                : 'game-screen',
            gameFooterId                : 'game-footer',  

            randomQuestion              : true,
            backsoundAudioName          : null,
            listeningMode               : false,

            pointsPerQuestion           : 1,
            questionElementId           : 'question',
            questionContainerElementId  : 'question-container',
            optionsContainerElementId   : 'options-container',
            feedbackElementId           : 'feedback',
            nextButtonElementId         : 'next-btn',
            loadingElementId            : 'loading',

            // progress bar variable
            progressBarElementId        : 'progress-bar',
            currentQuestionId           : 'current-question',
            totalQuestionsId            : 'total-questions',
            statTotalQuestionsId        : 'total-questions-info',
            statQuestionsTypeId         : 'question-types',

            // timer element
            timerElementId              : 'timer',
            ...config
        };


        // Initialize components
        this.questionApi = new QuestionAPI();
        this.timer = new Timer(this.config.timerElementId);
        this.progressTracker = new ProgressTracker({
            progressBarElementId: this.config.progressBarElementId,
            currentQuestionId: this.config.currentQuestionId,
            totalQuestionsId: this.config.totalQuestionsId
        });
        this.audioManager = new AudioManager({
            speechAudioId       : 'audio-speech',
            clickToSpeakClass   : 'click-to-speak',
            listeningMode       : this.config.listeningMode,
            backsoundAudioName  : this.config.backsoundAudioName,
        });

        // Game state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.questions = [];
        this.userAnswers = [];
        this.gameStarted = false;

        // DOM elements
        this.domElements = {
            startScreenElement        : document.getElementById(this.config.startScreenId),
            startGameButton           : document.getElementById(this.config.startGameBtnId),
            gameScreenElement         : document.getElementById(this.config.gameScreenId),
            gameFooterElement         : document.getElementById(this.config.gameFooterId),
            questionElement           : document.getElementById(this.config.questionElementId),
            questionContainer         : document.getElementById(this.config.questionContainerElementId),
            optionsContainer          : document.getElementById(this.config.optionsContainerElementId),
            feedbackElement           : document.getElementById(this.config.feedbackElementId),
            nextButton                : document.getElementById(this.config.nextButtonElementId),
            loadingElement            : document.getElementById(this.config.loadingElementId),
            statTotalQuestionsElement : document.getElementById(this.config.statTotalQuestionsId),
            statQuestionsTypeId       : document.getElementById(this.config.statQuestionsTypeId),
        };

        // Bind methods
        this.handleAnswer = this.handleAnswer.bind(this);

        // Initialize
        this.validateDOM();
        this.initEventListeners();
        this.showStartScreen();
    }

    validateDOM() {
        // Validate required DOM elements
        const requiredElements = ['questionContainer'];
        requiredElements.forEach(key => {
            if (!this.domElements[key]) {
                const idKey = `${key}Id`;
                throw new Error(`Missing required DOM element: ${this.config[idKey]}`);
            }
        });
    }

    initEventListeners() {
        // Default event listeners
        if (this.domElements.nextButton) {
            this.domElements.nextButton.addEventListener('click', () => this.nextQuestion());
        }
        if (this.domElements.startGameButton) {
            this.domElements.startGameButton.addEventListener('click', () => this.startGame());
        }
    }

    async initGame() {
        this.showLoading();
        try {
            this.questions = await this.fetchQuestions();
            this.progressTracker.setTotal(this.questions.length);            
            this.resetGameState();
            this.gameStarted = true;
            this.timer.start();
            this.loadQuestion();
        } catch (error) {
            this.showError(error.message);
            if (this.domElements.questionContainer) {
                this.domElements.questionContainer.appendChild(UIUtils.createRetryButton());
            }
        } finally {
            this.hideLoading();
        }
    }


    async showStartScreen() {
        const gameStat = await this.getGameStats();
        if (this.domElements.statTotalQuestionsElement) {
            this.domElements.statTotalQuestionsElement.textContent = gameStat.total_questions;
        }
        
    }


    startGame() {
        this.audioManager.playGameAudio('audio-true');
        this.domElements.startScreenElement.classList.add('d-none');
        this.domElements.gameScreenElement.style.display = 'block';
        this.domElements.gameFooterElement.style.display = 'block';

        // start game screen
        if (this.config.backsoundAudioName) {
            this.audioManager.playBacksound();
        }

        this.initGame();
    }


    async fetchQuestions() {
        const response = await this.questionApi.getAllQuestions();
        
        if (!response?.questions || !Array.isArray(response.questions)) {
            throw new Error('Invalid questions data from server');
        }
        if (response.questions.length === 0) {
            throw new Error('No questions available');
        }

        // Acak pakai sort (random)
        if (this.config.randomQuestion) {
            const questions = response.questions.sort(() => Math.random() - 0.5);

            return questions;
        }
        return response.questions;            
    }


    async getGameStats() {
        const response = await this.questionApi.getQuizStats();
        return response;
    }


    resetGameState() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.progressTracker.reset();
    }

    async loadQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            await this.endGame();
            this.progressTracker.setCurrent(this.questions.length);
            return;
        }

        this.showLoading();
        try {
            const question = this.questions[this.currentQuestionIndex];
            this.progressTracker.setCurrent(this.currentQuestionIndex);
            this.displayQuestion(question);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }

        // show speaker icon to speak for the first time
        this.audioManager.setupClickToSpeak();
        
    }


    disableAllOptions() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });
    }


    displayQuestion(question) {
        // Must be implemented by child class
        throw new Error('displayQuestion() must be implemented by child class');
    }


    async handleAnswer(answer) {
        // Must be implemented by child class
        throw new Error('handleAnswer() must be implemented by child class');
    }


    renderOptions(question) {
        // Must be implemented by child class
        throw new Error('handleAnswer() must be implemented by child class');
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.loadQuestion();
        this.clearFeedback();
        this.audioManager.playGameAudio('audio-next');
    }


    async endGame() {
        this.timer.stop();
        const timeString = this.timer.getTimeString();

        try {
            const finalScore = await this.questionApi.submitScore(this.userAnswers);
            UIUtils.showFinalResults(finalScore, timeString, true); // true = tampilkan detail
            this.audioManager.playGameAudio('audio-applause');
        } catch (error) {
            console.error("Error submitting score:", error);
            this.showFeedback("Error submitting score. Try again later", false);
        }
    }

    calculateFinalScore() {
        // Default scoring - can be overridden
        return Math.round((this.score / this.questions.length) * 100);
    }

    showLoading() {
        UIUtils.toggleLoading(this.domElements.loadingElement, true);
    }

    
    hideLoading() {
        UIUtils.toggleLoading(this.domElements.loadingElement, false);
    }

    showError(message) {
        if (this.domElements.feedbackElement) {
            UIUtils.showError(this.domElements.feedbackElement, message);
        } else {
            console.error(message);
        }
    }

    showFeedback(message, isSuccess = true) {
        if (this.domElements.feedbackElement) {
            UIUtils.showFeedback(this.domElements.feedbackElement, message, isSuccess);
        } else {
            console.error(message);
        }
    }

    clearFeedback() {
        UIUtils.clearFeedback(this.domElements.feedbackElement);
    }

}