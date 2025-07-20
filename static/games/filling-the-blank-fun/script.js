// Game data - random fill-in-the-blank questions for kids
const questions = [
    {
        sentence: "I have a ___ that says 'woof'.",
        options: ["cat", "dog", "bird", "fish"],
        answer: "dog"
    },
    {
        sentence: "We eat with a knife and ___.",
        options: ["spoon", "hammer", "book", "ball"],
        answer: "spoon"
    },
    {
        sentence: "Apples are usually red or ___.",
        options: ["blue", "green", "black", "purple"],
        answer: "green"
    },
    {
        sentence: "I wear ___ on my feet when I go outside.",
        options: ["gloves", "shoes", "hat", "scarf"],
        answer: "shoes"
    },
    {
        sentence: "The opposite of 'hot' is ___.",
        options: ["warm", "cold", "cool", "freezing"],
        answer: "cold"
    },
    {
        sentence: "We use an ___ to see in the dark.",
        options: ["umbrella", "flashlight", "book", "chair"],
        answer: "flashlight"
    },
    {
        sentence: "A baby cat is called a ___.",
        options: ["puppy", "kitten", "cub", "chick"],
        answer: "kitten"
    },
    {
        sentence: "We write with a pen or ___.",
        options: ["pencil", "brush", "stick", "rock"],
        answer: "pencil"
    },
    {
        sentence: "The color of grass is ___.",
        options: ["red", "blue", "green", "yellow"],
        answer: "green"
    },    
    {
        sentence: "The sun rises in the ___.",
        options: ["east", "west", "north", "south"],
        answer: "east"
    },
    {
        sentence: "Bees make ___.",
        options: ["milk", "honey", "juice", "water"],
        answer: "honey"
    },
    {
        sentence: "We drink water from a ___.",
        options: ["plate", "cup", "shoe", "book"],
        answer: "cup"
    },
    {
        sentence: "A baby dog is called a ___.",
        options: ["kitten", "puppy", "cub", "chick"],
        answer: "puppy"
    },
    {
        sentence: "We sleep in a ___.",
        options: ["chair", "bed", "table", "car"],
        answer: "bed"
    },
    {
        sentence: "The month after April is ___.",
        options: ["March", "May", "June", "July"],
        answer: "May"
    },
    {
        sentence: "We use an ___ to send letters.",
        options: ["envelope", "box", "bag", "bottle"],
        answer: "envelope"
    },
    {
        sentence: "The capital of France is ___.",
        options: ["London", "Berlin", "Paris", "Rome"],
        answer: "Paris"
    },
    {
        sentence: "We keep food cold in the ___.",
        options: ["oven", "refrigerator", "cupboard", "drawer"],
        answer: "refrigerator"
    },
    {
        sentence: "The color of snow is ___.",
        options: ["white", "black", "blue", "green"],
        answer: "white"
    },
    {
        sentence: "We tell time with a ___.",
        options: ["thermometer", "clock", "scale", "ruler"],
        answer: "clock"
    },
    {
        sentence: "The largest animal in the ocean is the ___.",
        options: ["shark", "dolphin", "whale", "octopus"],
        answer: "whale"
    },
    {
        sentence: "We cut paper with ___.",
        options: ["spoon", "fork", "scissors", "knife"],
        answer: "scissors"
    },
    {
        sentence: "The season after spring is ___.",
        options: ["winter", "summer", "autumn", "fall"],
        answer: "summer"
    },
    {
        sentence: "We see with our ___.",
        options: ["ears", "eyes", "nose", "mouth"],
        answer: "eyes"
    },
    {
        sentence: "The planet we live on is called ___.",
        options: ["Mars", "Venus", "Earth", "Jupiter"],
        answer: "Earth"
    },
    {
        sentence: "Rainbows have ___ colors.",
        options: ["three", "five", "seven", "nine"],
        answer: "seven"
    },
    {
        sentence: "We wash our hands with ___ and water.",
        options: ["soap", "juice", "milk", "oil"],
        answer: "soap"
    },
    {
        sentence: "The opposite of 'day' is ___.",
        options: ["morning", "afternoon", "night", "evening"],
        answer: "night"
    },
    {
        sentence: "We use a ___ to catch fish.",
        options: ["net", "bag", "box", "jar"],
        answer: "net"
    },
    {
        sentence: "The color of a banana is ___.",
        options: ["red", "yellow", "blue", "green"],
        answer: "yellow"
    },
    {
        sentence: "We wear a ___ when it rains.",
        options: ["hat", "scarf", "jacket", "umbrella"],
        answer: "umbrella"
    },
    {
        sentence: "The day after Tuesday is ___.",
        options: ["Monday", "Wednesday", "Friday", "Sunday"],
        answer: "Wednesday"
    },
    {
        sentence: "We breathe with our ___.",
        options: ["mouth", "nose", "ears", "eyes"],
        answer: "nose"
    },
    {
        sentence: "The capital of Japan is ___.",
        options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
        answer: "Tokyo"
    },
    {
        sentence: "We measure temperature with a ___.",
        options: ["ruler", "scale", "thermometer", "clock"],
        answer: "thermometer"
    },
    {
        sentence: "The color of an orange is ___.",
        options: ["orange", "purple", "pink", "brown"],
        answer: "orange"
    },
    {
        sentence: "We keep money in a ___.",
        options: ["wallet", "box", "bag", "bottle"],
        answer: "wallet"
    },
    {
        sentence: "The opposite of 'happy' is ___.",
        options: ["angry", "sad", "excited", "tired"],
        answer: "sad"
    },
    {
        sentence: "We use a ___ to take photos.",
        options: ["telephone", "camera", "computer", "radio"],
        answer: "camera"
    },
    {
        sentence: "The biggest continent is ___.",
        options: ["Africa", "Europe", "Asia", "Australia"],
        answer: "Asia"
    }
];


// Game variables
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let startTime;
let timerInterval;
let shuffledQuestions = [];

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const finalScoreElement = document.getElementById('final-score');
const finalTimeElement = document.getElementById('final-time');
const correctAnswersElement = document.getElementById('correct-answers');
const wrongAnswersElement = document.getElementById('wrong-answers');
const progressBar = document.getElementById('progress-bar');

// Start game
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function startGame() {
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    
    // Shuffle questions
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    
    // Show game screen
    startScreen.classList.add('d-none');
    resultScreen.classList.add('d-none');
    gameScreen.classList.remove('d-none');
    
    // Start timer
    startTime = new Date();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Load first question
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= shuffledQuestions.length) {
        endGame();
        return;
    }
    
    const question = shuffledQuestions[currentQuestionIndex];
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    totalQuestionsElement.textContent = shuffledQuestions.length;
    
    // Update progress bar
    const progress = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Display question with blank
    questionElement.textContent = question.sentence.replace('___', '______');
    
    // Clear previous options
    optionsElement.innerHTML = '';
    
    // Shuffle options
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    
    // Create option buttons
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary btn-option click-to-speak';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(option, question.answer));
        optionsElement.appendChild(button);
    });
}

function selectAnswer(selectedOption, correctAnswer) {
    const optionButtons = document.querySelectorAll('.btn-option');
    let isCorrect = false;
    
    // Disable all buttons
    optionButtons.forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.remove('btn-outline-primary');
            button.classList.add('correct');
        }
        
        if (button.textContent === selectedOption && selectedOption !== correctAnswer) {
            button.classList.remove('btn-outline-primary');
            button.classList.add('wrong');
        }
    });
    
    // Check answer
    if (selectedOption === correctAnswer) {
        isCorrect = true;
        correctAnswers++;
        playGameAudio('audio-true');
        questionElement.classList.add('correct-answer');
    } else {
        wrongAnswers++;
        playGameAudio('audio-false');
    }
    
    // Update score (scaled to 100)
    score = Math.round((correctAnswers / shuffledQuestions.length) * 100);
    scoreElement.textContent = score;
    
    // Move to next question after delay
    setTimeout(() => {
        questionElement.classList.remove('correct-answer');
        currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timerElement.textContent = `${minutes}:${seconds}`;
}

function endGame() {
    clearInterval(timerInterval);
    
    // Calculate final score
    const finalScore = Math.round((correctAnswers / shuffledQuestions.length) * 100);
    
    // Show result screen
    gameScreen.classList.add('d-none');
    resultScreen.classList.remove('d-none');
    
    // Update result stats
    finalScoreElement.textContent = finalScore;
    finalTimeElement.textContent = timerElement.textContent;
    correctAnswersElement.textContent = correctAnswers;
    wrongAnswersElement.textContent = wrongAnswers;
    
    // Speak completion message
    speak(`Game completed! Your score is ${finalScore} out of 100. You got ${correctAnswers} correct and ${wrongAnswers} wrong answers.`);
}

// Initialize
totalQuestionsElement.textContent = questions.length;