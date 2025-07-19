const questions = [
    // Basic Vocabulary (10 questions)
    {
        audioText: "What color is the sun?",
        options: [
            "The sun is blue",
            "The sun is yellow", 
            "The sun is black",
            "The sun is purple"
        ],
        correct: 1,
        level: "easy"
    },
    {
        audioText: "Which animal says 'meow'?",
        options: [
            "Dogs say meow",
            "Cats say meow",
            "Cows say meow",
            "Lions never meow"
        ],
        correct: 1,
        level: "easy"
    },
    {
        audioText: "What do we call a baby dog?",
        options: [
            "A baby dog is called a kitten",
            "A baby dog is called a puppy",
            "A baby dog is called a cub",
            "A baby dog is called a chick"
        ],
        correct: 1,
        level: "easy"
    },
    {
        audioText: "Which object can you write with?",
        options: [
            "You can write with a banana",
            "You can write with a pencil",
            "You can write with a chair",
            "You can write with water"
        ],
        correct: 1,
        level: "easy"
    },
    {
        audioText: "What do you wear on your feet?",
        options: [
            "I wear gloves on my feet",
            "I wear socks on my feet",
            "I wear hats on my feet",
            "I wear scarves on my feet"
        ],
        correct: 1,
        level: "easy"
    },

    // Sentence Comprehension (10 questions)
    {
        audioText: "What should you do when you're hungry?",
        options: [
            "When I'm hungry I go to sleep",
            "When I'm hungry I eat food",
            "When I'm hungry I wash my hands",
            "When I'm hungry I read a book"
        ],
        correct: 1,
        level: "medium"
    },
    {
        audioText: "Where do fish live?",
        options: [
            "Fish live in trees",
            "Fish live in the ocean",
            "Fish live in cars",
            "Fish live in shoes"
        ],
        correct: 1,
        level: "medium"
    },
    {
        audioText: "What happens when you drop a ball?",
        options: [
            "The ball flies to the moon",
            "The ball falls to the ground",
            "The ball turns into water",
            "The ball starts singing"
        ],
        correct: 1,
        level: "medium"
    },
    {
        audioText: "Why do we use umbrellas?",
        options: [
            "We use umbrellas to cook food",
            "We use umbrellas to stay dry in rain",
            "We use umbrellas to brush our teeth",
            "We use umbrellas to ride bicycles"
        ],
        correct: 1,
        level: "medium"
    },
    {
        audioText: "How do you make a sandwich?",
        options: [
            "You make a sandwich with paper and glue",
            "You make a sandwich with bread and toppings",
            "You make a sandwich with water and air",
            "You make a sandwich with rocks and leaves"
        ],
        correct: 1,
        level: "medium"
    },

    // Story-Based Questions (10 questions)
    {
        audioText: "Tom has 3 apples. He gives 1 to Mary. How many apples does Tom have now?",
        options: [
            "Tom now has 3 apples",
            "Tom now has 2 apples",
            "Tom now has 1 apple",
            "Tom now has 4 apples"
        ],
        correct: 1,
        level: "hard"
    },
    {
        audioText: "The sky is getting dark. What will probably happen next?",
        options: [
            "The sun will shine brighter",
            "It will probably rain soon",
            "All the birds will disappear",
            "The trees will grow instantly"
        ],
        correct: 1,
        level: "hard"
    },
    {
        audioText: "Sarah is wearing a coat, gloves, and a scarf. What season is it?",
        options: [
            "It must be summer",
            "It must be winter",
            "It must be spring",
            "It must be autumn"
        ],
        correct: 1,
        level: "hard"
    },
    {
        audioText: "If you mix red and yellow paint, what color do you get?",
        options: [
            "You get purple paint",
            "You get orange paint",
            "You get green paint",
            "You get blue paint"
        ],
        correct: 1,
        level: "hard"
    },
    {
        audioText: "Which item doesn't belong: apple, banana, carrot, orange?",
        options: [
            "The apple doesn't belong",
            "The banana doesn't belong",
            "The carrot doesn't belong",
            "The orange doesn't belong"
        ],
        correct: 2,
        level: "hard"
    }
];


// Game variables
let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let isPlaying = false;

// DOM elements
const startBtn = document.getElementById('startBtn');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const feedback = document.getElementById('feedback');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

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
    
    loadQuestion();
    startTimer();
}

// Load question
async function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    const q = questions[currentQuestion];
    questionText.textContent = "🔊 Listening...";
    questionText.classList.add('text-primary');
    
    // Speak the question
    await speak(q.audioText);
    
    questionText.textContent = q.audioText;
    questionText.classList.remove('text-primary');
    
    // Create options
    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary w-100 py-3 mb-3 answer-btn click-to-speak';
        btn.innerHTML = `<i class="fas fa-hand-point-right me-2"></i>${option}`;
        btn.onclick = () => checkAnswer(index);
        
        col.appendChild(btn);
        optionsContainer.appendChild(col);
    });
}

// Check answer
async function checkAnswer(selectedIndex) {
    const q = questions[currentQuestion];
    
    if (selectedIndex === q.correct) {
        score++;
        showFeedback("Correct! 🎉", "success");
        playGameAudio('game-audio-true');
    } else {
        showFeedback(`Oops! Correct answer: ${q.options[q.correct]}`, "danger");
        playGameAudio('game-audio-false');
    }
    
    updateScore();
    currentQuestion++;
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
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 10) {
        timerDisplay.classList.add('text-danger');
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
    questionText.textContent = `Game Over! Final Score: ${score}`;
    optionsContainer.innerHTML = '';
    feedback.textContent = "Refresh to play again!";
    feedback.className = "alert alert-info";
    feedback.style.display = 'block';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initGame);