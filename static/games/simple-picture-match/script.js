// Game data with contextual sentences (30 questions)
const games = [
    // Animals (6 questions)
    {
        emoji: "🐶",
        animation: "tada",
        options: [
            "This is a dog playing in the park",
            "This is a cat sleeping on a sofa", 
            "This is a bird flying in the sky",
            "This is a fish swimming in water"
        ],
        correct: 0,
        prompt: "What is happening in the picture?"
    },
    {
        emoji: "🐱",
        animation: "wobble",
        options: [
            "A dog is barking loudly",
            "A cat is licking its paws",
            "A rabbit is hopping in grass",
            "A mouse is eating cheese"
        ],
        correct: 1,
        prompt: "What is the animal doing?"
    },
    // Food (6 questions)
    {
        emoji: "🍎",
        animation: "bounce",
        options: [
            "Someone is driving a red car",
            "A child is eating a red apple",
            "A family is buying a new house",
            "A student is reading a thick book"
        ],
        correct: 1,
        prompt: "What do you see?"
    },
    {
        emoji: "🍕",
        animation: "spin",
        options: [
            "A pizza is being baked in oven",
            "A burger is on the grill",
            "Spaghetti is boiling in water",
            "Salad is being chopped"
        ],
        correct: 0,
        prompt: "What food is this?"
    },
    // Sports (6 questions)
    {
        emoji: "⚽",
        animation: "shake",
        options: [
            "Children are playing soccer with a ball",
            "A woman is wearing new shoes",
            "A gardener is planting a tree",
            "People are swimming in the water"
        ],
        correct: 0,
        prompt: "What activity is this?"
    },
    // Weather (6 questions)
    {
        emoji: "🌞",
        animation: "swing",
        options: [
            "The moon is shining at night",
            "The sun is rising in the morning",
            "Stars are twinkling in space",
            "Clouds are moving in the sky"
        ],
        correct: 1,
        prompt: "Describe the weather:"
    },
    // Vehicles (6 questions)
    {
        emoji: "🚗",
        animation: "drive",
        options: [
            "A car is driving on the road",
            "A boat is sailing on the sea",
            "A plane is flying in the air",
            "A bike is parked in the garage"
        ],
        correct: 0,
        prompt: "What vehicle is this?"
    }
    // Add more categories here...
];

// Game variables
let currentGame = 0;
let score = 0;
let timeLeft = 60;
let timer;
let isPlaying = false;

// DOM elements
const animatedPicture = document.getElementById('animatedPicture');
const promptText = document.getElementById('promptText');
const optionsContainer = document.getElementById('optionsContainer');
const feedback = document.getElementById('feedback');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

// Initialize game
function initGame() {
    startBtn.addEventListener('click', startGame);
}

// Start the game
function startGame() {
    isPlaying = true;
    startBtn.style.display = 'none';
    questionText.style.display = 'block';
    optionsContainer.style.display = 'flex';
    score = 0;
    currentGame = 0;
    timeLeft = 60;
    
    updateScore();
    loadGame();
    startTimer();
}

// Load game with animation
function loadGame() {
    if (currentGame >= games.length) {
        endGame();
        return;
    }

    const game = games[currentGame];
    
    // Set animated emoji
    animatedPicture.innerHTML = game.emoji;
    animatedPicture.style.animation = `${game.animation} 2s infinite`;
    
    // Set prompt
    promptText.textContent = game.prompt;
    
    // Create options
    optionsContainer.innerHTML = '';
    game.options.forEach((option, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary w-100 py-3 mb-3 answer-btn click-to-speak';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(index);
        
        col.appendChild(btn);
        optionsContainer.appendChild(col);
    });
}

// Check answer
function checkAnswer(selectedIndex) {
    const game = games[currentGame];
    
    // Disable all buttons after selection
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
    });

    if (selectedIndex === game.correct) {
        score++;
        showFeedback(`Correct! ${game.options[game.correct]}`, "success");
        playGameAudio('audio-true');
        animatedPicture.style.animation = "jump 0.5s";
    } else {
        showFeedback(`Almost! ${game.options[game.correct]}`, "danger");
        playGameAudio('audio-false');
        animatedPicture.style.animation = "shake 0.5s";
    }
    
    updateScore();
    currentGame++;
    
    // Load next question or end game
    if (currentGame < games.length) {
        setTimeout(loadGame, 2000);
    } else {
        setTimeout(endGame, 2000);
    }
}

// Show feedback message
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `alert alert-${type} text-center show`;
    
    setTimeout(() => {
        feedback.className = feedback.className.replace('show', '');
    }, 1500);
}

// Timer functions
function startTimer() {
    clearInterval(timer); // Clear any existing timer
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 10) {
        timerDisplay.classList.add('text-danger');
    } else {
        timerDisplay.classList.remove('text-danger');
    }
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
    isPlaying = false;
    
    animatedPicture.style.animation = '';
    animatedPicture.textContent = "🏆";
    promptText.textContent = `Game Over! Score: ${score}/${games.length}`;
    optionsContainer.innerHTML = '';
    
    // Show restart button
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn btn-warning btn-lg';
    restartBtn.textContent = 'Play Again';
    restartBtn.onclick = () => window.location.reload();
    optionsContainer.appendChild(restartBtn);
}

// Additional animations
const style = document.createElement('style');
style.textContent = `
    @keyframes jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-30px); }
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    @keyframes drive {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(20px); }
    }
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', initGame);