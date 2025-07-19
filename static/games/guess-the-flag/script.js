// Country data with flag emojis
const countries = [
    { name: "United States", flag: "🇺🇸" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "France", flag: "🇫🇷" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "India", flag: "🇮🇳" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "China", flag: "🇨🇳" },
    { name: "Russia", flag: "🇷🇺" },
    { name: "Argentina", flag: "🇦🇷" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "Sweden", flag: "🇸🇪" },
    { name: "Norway", flag: "🇳🇴" },
    { name: "Finland", flag: "🇫🇮" },
    { name: "Denmark", flag: "🇩🇰" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "Belgium", flag: "🇧🇪" },
    { name: "Switzerland", flag: "🇨🇭" },
    { name: "Portugal", flag: "🇵🇹" },
    { name: "Greece", flag: "🇬🇷" },
    { name: "Turkey", flag: "🇹🇷" },
    { name: "Thailand", flag: "🇹🇭" },
    { name: "Vietnam", flag: "🇻🇳" },
    { name: "Indonesia", flag: "🇮🇩" },
    { name: "Malaysia", flag: "🇲🇾" },
    { name: "Philippines", flag: "🇵🇭" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "New Zealand", flag: "🇳🇿" },
    { name: "Ireland", flag: "🇮🇪" },
    { name: "Poland", flag: "🇵🇱" },
    { name: "Ukraine", flag: "🇺🇦" },
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "United Arab Emirates", flag: "🇦🇪" },
    { name: "Israel", flag: "🇮🇱" },
    { name: "Qatar", flag: "🇶🇦" },
    { name: "Pakistan", flag: "🇵🇰" },
    { name: "Bangladesh", flag: "🇧🇩" },
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Ethiopia", flag: "🇪🇹" },
    { name: "Morocco", flag: "🇲🇦" },
    { name: "Peru", flag: "🇵🇪" },
    { name: "Colombia", flag: "🇨🇴" },
    { name: "Chile", flag: "🇨🇱" }
];

// The rest of your game code remains the same...

// Game variables
let currentCountry;
let score = 0;
let timeLeft = 60;
let timer;

// DOM elements
const flagDisplay = document.getElementById('flagDisplay');
const countryName = document.getElementById('countryName');
const optionsContainer = document.getElementById('optionsContainer');
const feedback = document.getElementById('feedback');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

// Initialize game
function initGame() {
    loadQuestion();
    startTimer();
}

// Load a new question
function loadQuestion() {
    // Select random country
    currentCountry = countries[Math.floor(Math.random() * countries.length)];
    
    // Display flag
    flagDisplay.innerHTML = `<div class="flag-emoji">${currentCountry.flag}</div>`;
    countryName.textContent = "Which country is this?";
    
    // Generate options
    const options = generateOptions(currentCountry);
    renderOptions(options);
}

// Generate 4 options (1 correct + 3 random)
function generateOptions(correctCountry) {
    const options = [correctCountry.name];
    
    while (options.length < 4) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)].name;
        if (!options.includes(randomCountry)) {
            options.push(randomCountry);
        }
    }
    
    return shuffleArray(options);
}

// Render options as buttons
function renderOptions(options) {
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary w-100 py-3 mb-3 answer-btn click-to-speak';
        button.textContent = option;
        
        button.addEventListener('click', () => checkAnswer(option));
        col.appendChild(button);
        optionsContainer.appendChild(col);
    });
}

// Check user's answer
function checkAnswer(selectedOption) {
    if (selectedOption === currentCountry.name) {
        score++;
        showFeedback("Correct! Well done!", "success");
        playGameAudio('game-audio-true');
        countryName.textContent = currentCountry.name;
    } else {
        showFeedback(`Oops! It's ${currentCountry.name}`, "danger");
        playGameAudio('game-audio-false');
    }
    
    updateScore();
    setTimeout(loadQuestion, 1500);
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
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
    scoreDisplay.classList.add('animate__animated', 'animate__bounce');
    setTimeout(() => {
        scoreDisplay.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    flagDisplay.innerHTML = '<div class="fs-1">🏁</div>';
    countryName.textContent = `Game Over! Score: ${score}`;
    optionsContainer.innerHTML = '';
    feedback.textContent = "Refresh to play again!";
    feedback.className = "alert alert-info";
    feedback.style.display = 'block';
}

// Helper function to shuffle array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Start game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);