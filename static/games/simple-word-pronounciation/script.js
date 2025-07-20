// Word list - 50 simple English words for children
const wordList = [
    "apple", "banana", "cat", "dog", "elephant",
    "fish", "giraffe", "house", "ice", "jump",
    "kite", "lion", "monkey", "nose", "orange",
    "pig", "queen", "rabbit", "sun", "tree",
    "umbrella", "van", "water", "box", "yellow",
    "zoo", "ball", "car", "duck", "egg",
    "flower", "green", "hat", "ink", "juice",
    "king", "leg", "milk", "net", "owl",
    "pen", "quilt", "red", "ship", "train",
    "up", "violin", "window", "fox", "yo-yo"
];

// Game variables
let currentWordIndex = 0;
let score = 0;
let correctCount = 0;
let startTime;
let timerInterval;
let recognition;
let shuffledWords = [];

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const speakBtn = document.getElementById('speak-btn');
const repeatBtn = document.getElementById('repeat-btn');
const restartBtn = document.getElementById('restart-btn');
const currentWordEl = document.getElementById('current-word');
const progressEl = document.getElementById('progress');
const scoreEl = document.getElementById('score');
const correctCountEl = document.getElementById('correct-count');
const finalScoreEl = document.getElementById('final-score');
const finalTimeEl = document.getElementById('final-time');
const timeElapsedEl = document.getElementById('time-elapsed');
const progressBar = document.getElementById('progress-bar');
const feedbackEl = document.querySelector('.feedback');

// Initialize the game
function initGame() {
    // Shuffle the word list
    shuffledWords = [...wordList].sort(() => Math.random() - 0.5);
    currentWordIndex = 0;
    score = 0;
    correctCount = 0;
    updateProgress();
    updateScore();
    
    // Show first word
    showCurrentWord();
    
    // Start timer
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

// Show current word
function showCurrentWord() {
    currentWordEl.textContent = shuffledWords[currentWordIndex];
    speak(currentWordEl.textContent); // Speak the word automatically
}

// Update progress
function updateProgress() {
    progressEl.textContent = currentWordIndex;
    progressBar.style.width = `${(currentWordIndex / wordList.length) * 100}%`;
}

// Update score
function updateScore() {
    const calculatedScore = Math.floor((correctCount / wordList.length) * 100);
    scoreEl.textContent = calculatedScore;
}

// Update timer
function updateTimer() {
    const elapsed = Math.floor((new Date() - startTime) / 1000);
    timeElapsedEl.textContent = `Time: ${elapsed}s`;
    return elapsed;
}

// Check pronunciation
function checkPronunciation() {
    if (!recognition) {
        initSpeechRecognition();
    }

    feedbackEl.classList.add('d-none');
    speakBtn.disabled = true;
    speakBtn.innerHTML = '<i class="fas fa-microphone-slash me-2"></i>Listening...';
    
    recognition.start();
}

// Initialize speech recognition
function initSpeechRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
        const spokenWord = shuffledWords[currentWordIndex].toLowerCase();
        let isCorrect = false;
        let confidence = 0;

        // Check all alternatives
        for (let i = 0; i < event.results[0].length; i++) {
            const transcript = event.results[0][i].transcript.toLowerCase().trim();
            if (transcript === spokenWord) {
                isCorrect = true;
                confidence = event.results[0][i].confidence;
                break;
            }
        }

        // Provide feedback
        if (isCorrect) {
            playGameAudio('audio-true');
            correctCount++;
            score = Math.floor((correctCount / wordList.length) * 100);
            feedbackEl.textContent = `Great! You said "${spokenWord}" correctly!`;
            feedbackEl.className = 'feedback alert alert-success';
            currentWordEl.classList.add('correct-animation');
            setTimeout(() => currentWordEl.classList.remove('correct-animation'), 500);
        } else {
            playGameAudio('audio-false');
            feedbackEl.textContent = `Try again! You said "${event.results[0][0].transcript}" but the word is "${spokenWord}".`;
            feedbackEl.className = 'feedback alert alert-danger';
            currentWordEl.classList.add('wrong-animation');
            setTimeout(() => currentWordEl.classList.remove('wrong-animation'), 500);
        }

        feedbackEl.classList.remove('d-none');
        updateScore();

        // Move to next word or end game
        currentWordIndex++;
        if (currentWordIndex < wordList.length) {
            setTimeout(() => {
                showCurrentWord();
                updateProgress();
                speakBtn.disabled = false;
                speakBtn.innerHTML = '<i class="fas fa-microphone me-2"></i>Speak';
            }, 1500);
        } else {
            endGame();
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        feedbackEl.textContent = 'Error: Could not hear you. Try again!';
        feedbackEl.className = 'feedback alert alert-warning';
        feedbackEl.classList.remove('d-none');
        speakBtn.disabled = false;
        speakBtn.innerHTML = '<i class="fas fa-microphone me-2"></i>Speak';
    };

    recognition.onend = () => {
        if (currentWordIndex < wordList.length) {
            speakBtn.disabled = false;
            speakBtn.innerHTML = '<i class="fas fa-microphone me-2"></i>Speak';
        }
    };
}

// End game
function endGame() {
    clearInterval(timerInterval);
    const elapsedTime = updateTimer();
    
    gameScreen.classList.add('d-none');
    resultScreen.classList.remove('d-none');
    
    correctCountEl.textContent = correctCount;
    finalScoreEl.textContent = Math.floor((correctCount / wordList.length) * 100);
    finalTimeEl.textContent = `${elapsedTime}s`;
}

// Event listeners
startBtn.addEventListener('click', () => {
    startScreen.classList.add('d-none');
    gameScreen.classList.remove('d-none');
    initGame();
});

speakBtn.addEventListener('click', checkPronunciation);

repeatBtn.addEventListener('click', () => {
    speak(currentWordEl.textContent);
});

restartBtn.addEventListener('click', () => {
    resultScreen.classList.add('d-none');
    gameScreen.classList.remove('d-none');
    initGame();
});

// Initialize speech recognition when the game screen is shown
gameScreen.addEventListener('DOMNodeInserted', () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        speakBtn.disabled = false;
    } else {
        speakBtn.disabled = true;
        feedbackEl.textContent = 'Speech recognition is not supported in your browser. Try Chrome or Edge.';
        feedbackEl.className = 'feedback alert alert-warning';
        feedbackEl.classList.remove('d-none');
    }
});