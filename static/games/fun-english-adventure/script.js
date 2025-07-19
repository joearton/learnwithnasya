// Game Data - Fokus pada kalimat
const sentences = [
    { 
        sentence: "I eat an apple every morning", 
        keywords: ["apple", "eat", "morning"],
        translation: "Saya makan apel setiap pagi" 
    },
    { 
        sentence: "The cat is sleeping on the sofa", 
        keywords: ["cat", "sleeping", "sofa"],
        translation: "Kucing sedang tidur di sofa" 
    },
    { 
        sentence: "We need to walk the dog in the park", 
        keywords: ["walk", "dog", "park"],
        translation: "Kita perlu ajak anjing jalan di taman" 
    },
    { 
        sentence: "Elephants are the largest land animals", 
        keywords: ["elephants", "largest", "land"],
        translation: "Gajah adalah hewan darat terbesar" 
    },
    { 
        sentence: "She waters the flowers every evening", 
        keywords: ["waters", "flowers", "evening"],
        translation: "Dia menyiram bunga setiap sore" 
    }
];

// Game State
let currentSentenceIndex = 0;
let score = 0;
let timeLeft = 60;
let timer;
let recognition;

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

function initGame() {
    // Initialize DOM elements after load
    const micButton = document.getElementById('micButton');
    const feedbackEl = document.getElementById('feedback');
    const userSpeechEl = document.querySelector('.user-speech-feedback');
    const userTextEl = document.querySelector('.user-text');
    const scoreEl = document.getElementById('score');
    const timerEl = document.getElementById('timer');
    const progressEl = document.getElementById('progress');
    const browserSupportAlert = document.getElementById('browserSupportAlert');
    const browserSupportText = document.getElementById('browserSupportText');
    const currentSentenceEl = document.getElementById('currentSentence');

    checkBrowserSupport();
    updateScore();
    updateProgress();
    loadSentence();
    startTimer();
    setupSpeechRecognition();
    

    function checkBrowserSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            const supportedBrowsers = [
                "Google Chrome (Desktop & Android)",
                "Microsoft Edge",
                "Safari (macOS/iOS 14.5+)",
                "Opera"
            ];
            
            browserSupportText.innerHTML = `Speech recognition not supported. Try on: <strong>${supportedBrowsers.join(', ')}</strong>`;
            browserSupportAlert.classList.remove('d-none');
            micButton.disabled = true;
            console.log("Browser doesn't support SpeechRecognition");
        } else {
            console.log("SpeechRecognition supported");
        }
    }

    // Load Current Sentence
    function loadSentence() {
        const sentenceObj = sentences[currentSentenceIndex];
        currentSentenceEl.innerHTML = `
            <div class="sentence-text h4 fw-bold mb-2">${sentenceObj.sentence}</div>
            <div class="sentence-translation text-white-50">${sentenceObj.translation}</div>
        `;
    }

    // Speech Recognition Setup
    function setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        micButton.addEventListener('click', function() {
            if (micButton.classList.contains('btn-danger')) {
                try {
                    recognition.start();
                    micButton.classList.replace('btn-danger', 'btn-warning');
                    micButton.innerHTML = '<i class="fas fa-microphone-slash fa-2x"></i>';
                    feedbackEl.textContent = "Listening... Speak now!";
                    userSpeechEl.classList.add('d-none');
                    console.log("Recognition started");
                } catch (e) {
                    console.error("Recognition error:", e);
                    feedbackEl.textContent = "Error starting microphone";
                }
            } else {
                recognition.stop();
                micButton.classList.replace('btn-warning', 'btn-danger');
                micButton.innerHTML = '<i class="fas fa-microphone fa-2x"></i>';
                console.log("Recognition stopped");
            }
        });

        recognition.onresult = function(event) {
            const spokenText = event.results[0][0].transcript.trim();
            console.log("You said:", spokenText);
            checkAnswer(spokenText);
        };

        recognition.onerror = function(event) {
            console.error("Recognition error:", event.error);
            feedbackEl.textContent = "Error: " + event.error;
            micButton.classList.replace('btn-warning', 'btn-danger');
            micButton.innerHTML = '<i class="fas fa-microphone fa-2x"></i>';
        };

        recognition.onend = function() {
            if (micButton.classList.contains('btn-warning')) {
                recognition.start(); // Continue listening
            }
        };
    }

    // Check Spoken Answer
    function checkAnswer(spokenText) {
        const currentSentence = sentences[currentSentenceIndex];
        const lowerSpoken = spokenText.toLowerCase();
        const lowerSentence = currentSentence.sentence.toLowerCase();
        
        // Tampilkan ucapan pengguna
        userSpeechEl.classList.remove('d-none');
        userTextEl.textContent = spokenText;
        
        // Cek kecocokan
        let isCorrect = false;
        
        // 1. Cek keseluruhan kalimat
        if (lowerSpoken === lowerSentence) {
            isCorrect = true;
        } 
        // 2. Cek kata kunci penting
        else {
            const keywordMatch = currentSentence.keywords.filter(keyword => 
                lowerSpoken.includes(keyword.toLowerCase())
            ).length;
            
            isCorrect = keywordMatch >= 2; // Minimal 2 kata kunci benar
        }
        
        // Berikan feedback
        if (isCorrect) {
            feedbackEl.innerHTML = `<span class="text-success">✅ Perfect! <i class="fas fa-check-circle"></i></span>`;
            playGameAudio('game-audio-true');
            score += 20;
            updateScore();
            setTimeout(nextSentence, 1500);
        } else {
            feedbackEl.innerHTML = `
                <span class="text-danger">❌ Almost! Try again: 
                    <button class="btn btn-sm btn-outline-primary ms-2 click-to-speak">
                        <i class="fas fa-volume-up me-1"></i>Hear again
                    </button>
                </span>
            `;
            playGameAudio('game-audio-false');
        }
        
        micButton.classList.replace('btn-warning', 'btn-danger');
        micButton.innerHTML = '<i class="fas fa-microphone fa-2x"></i>';
    }

    // Move to Next Sentence
    function nextSentence() {
        currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length;
        updateProgress();
        loadSentence();
        userSpeechEl.classList.add('d-none');
        feedbackEl.textContent = '';
    }

    // Update Score
    function updateScore() {
        scoreEl.textContent = score;
    }

    // Update Progress
    function updateProgress() {
        progressEl.textContent = `${currentSentenceIndex + 1}/${sentences.length}`;
    }

    // Timer Function
    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                feedbackEl.innerHTML = `<span class="text-danger">⏰ Time's up! Your score: ${score}</span>`;
                micButton.disabled = true;
                if (recognition) recognition.stop();
            }
        }, 1000);
    }
};