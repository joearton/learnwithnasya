// Game data - simple words for children with phonetic guides
const words = [
    { word: "Apple", phonetic: "/ˈæp.əl/" },
    { word: "Banana", phonetic: "/bəˈnæn.ə/" },
    { word: "Cat", phonetic: "/kæt/" },
    { word: "Dog", phonetic: "/dɒɡ/" },
    { word: "Elephant", phonetic: "/ˈel.ɪ.fənt/" },
    { word: "Fish", phonetic: "/fɪʃ/" },
    { word: "Giraffe", phonetic: "/dʒɪˈrɑːf/" },
    { word: "House", phonetic: "/haʊs/" },
    { word: "Ice cream", phonetic: "/ˈaɪs kriːm/" },
    { word: "Jump", phonetic: "/dʒʌmp/" },
    { word: "Kite", phonetic: "/kaɪt/" },
    { word: "Lemon", phonetic: "/ˈlem.ən/" },
    { word: "Monkey", phonetic: "/ˈmʌŋ.ki/" },
    { word: "Nest", phonetic: "/nest/" },
    { word: "Orange", phonetic: "/ˈɒr.ɪndʒ/" }
];

// Game variables
let currentWordIndex = 0;
let score = 0;
let timeLeft = 60; // 1 minute timer
let timer;

// DOM elements
const wordDisplay = document.getElementById('wordDisplay');
const phoneticDisplay = document.getElementById('phoneticDisplay');
const repeatBtn = document.getElementById('repeatBtn');
const answerBtns = document.querySelectorAll('.answer-btn');
const feedback = document.getElementById('feedback');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const progressBar = document.getElementById('progressBar');

// Initialize game
function initGame() {
    loadWord();
    startTimer();
    
    repeatBtn.addEventListener('click', () => {
        // Highlight elements to show they're being read
        highlightElements([wordDisplay, phoneticDisplay]);
    });
    
    answerBtns.forEach(btn => {
        btn.addEventListener('click', handleAnswer);
    });
}

// Highlight elements being read
function highlightElements(elements) {
    elements.forEach(el => {
        el.classList.add('text-primary', 'fw-bold');
        setTimeout(() => {
            el.classList.remove('text-primary', 'fw-bold');
        }, 1000);
    });
}

// Load current word
function loadWord() {
    const wordData = words[currentWordIndex];
    wordDisplay.textContent = wordData.word;
    phoneticDisplay.textContent = wordData.phonetic;
    
    // Auto-speak the new word
    highlightElements([wordDisplay, phoneticDisplay]);
}

// Handle user answer
function handleAnswer(e) {
    const isCorrect = e.target.dataset.correct === 'true';
    
    if (isCorrect) {
        score++;
        showFeedback("Great pronunciation! 👍", "success");
    } else {
        showFeedback("Keep practicing! 👂", "warning");
    }
    
    updateScore();
    nextWord();
}

// Show feedback message
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `alert alert-${type} text-center`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 1500);
}

// Move to next word
function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    loadWord();
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
    scoreDisplay.classList.add('animate__animated', 'animate__bounce');
    setTimeout(() => {
        scoreDisplay.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
}

// Timer functions
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress bar
    const progressPercent = (timeLeft / 60) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Change color when time is running low
    if (timeLeft <= 15) {
        progressBar.classList.remove('bg-info');
        progressBar.classList.add('bg-danger');
    }
}

function endGame() {
    clearInterval(timer);
    wordDisplay.textContent = "Great effort!";
    phoneticDisplay.textContent = "";
    repeatBtn.disabled = true;
    answerBtns.forEach(btn => btn.disabled = true);
    
    showFeedback(`Game Over! Final Score: ${score}`, "info");
}

// Start game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);