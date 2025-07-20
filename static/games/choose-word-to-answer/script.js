// Game variables
let currentQuestionIndex = 0;
let score = 0;
let startTime;
let questions = [];
let totalQuestions = 30;

// DOM elements
const questionElement = document.getElementById('question');
const questionImageElement = document.getElementById('question-image');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const currentQuestionText = document.getElementById('current-question');
const totalQuestionsText = document.getElementById('total-questions');
const feedbackCorrect = document.getElementById('feedback-correct');
const feedbackWrong = document.getElementById('feedback-wrong');
const nextButton = document.getElementById('next-btn');


const questionBank = [
    // Animals (5 questions)
    {
        question: "Which word means 'a large animal with a trunk'?",
        image: "https://cdn.pixabay.com/photo/2017/03/30/17/42/elephant-2189147_640.png",
        options: ["Dog", "Elephant", "Cat", "Bird"],
        answer: "Elephant"
    },
    {
        question: "What is this animal called?",
        image: "https://cdn.pixabay.com/photo/2013/07/12/18/20/sheep-153375_640.png",
        options: ["Cow", "Sheep", "Horse", "Pig"],
        answer: "Sheep"
    },
    {
        question: "Which animal says 'meow'?",
        options: ["Dog", "Cow", "Cat", "Duck"],
        answer: "Cat"
    },
    {
        question: "Which animal can fly?",
        options: ["Fish", "Elephant", "Bird", "Rabbit"],
        answer: "Bird"
    },
    {
        question: "What do you call this sea animal?",
        image: "https://cdn.pixabay.com/photo/2013/07/12/15/36/dolphin-150195_640.png",
        options: ["Shark", "Dolphin", "Whale", "Octopus"],
        answer: "Dolphin"
    },

    // Colors (5 questions)
    {
        question: "Choose the word for this color:",
        image: "https://cdn.pixabay.com/photo/2017/01/10/03/06/red-1968246_640.png",
        options: ["Blue", "Green", "Red", "Yellow"],
        answer: "Red"
    },
    {
        question: "What color is the sky on a sunny day?",
        options: ["Green", "Blue", "Red", "Black"],
        answer: "Blue"
    },
    {
        question: "Which color is a banana?",
        options: ["Purple", "Yellow", "Pink", "Brown"],
        answer: "Yellow"
    },
    {
        question: "What color do you get when you mix red and white?",
        options: ["Pink", "Green", "Orange", "Gray"],
        answer: "Pink"
    },
    {
        question: "Which color is grass?",
        options: ["Blue", "Red", "Green", "White"],
        answer: "Green"
    },

    // Fruits (5 questions)
    {
        question: "Which word is a fruit?",
        options: ["Carrot", "Apple", "Broccoli", "Potato"],
        answer: "Apple"
    },
    {
        question: "What is this fruit called?",
        image: "https://cdn.pixabay.com/photo/2016/01/05/13/58/apple-1122537_640.jpg",
        options: ["Orange", "Banana", "Apple", "Grape"],
        answer: "Apple"
    },
    {
        question: "Which fruit is yellow and curved?",
        options: ["Apple", "Grape", "Banana", "Strawberry"],
        answer: "Banana"
    },
    {
        question: "Which fruit has seeds on the outside?",
        options: ["Watermelon", "Pineapple", "Strawberry", "Orange"],
        answer: "Strawberry"
    },
    {
        question: "What is small, red, and sweet?",
        options: ["Watermelon", "Cherry", "Pumpkin", "Lemon"],
        answer: "Cherry"
    },

    // Objects (5 questions)
    {
        question: "What do you call this object?",
        image: "https://cdn.pixabay.com/photo/2013/07/12/18/39/pencil-153508_640.png",
        options: ["Book", "Pencil", "Chair", "Table"],
        answer: "Pencil"
    },
    {
        question: "Which object do you use to write on paper?",
        options: ["Eraser", "Pen", "Ruler", "Glue"],
        answer: "Pen"
    },
    {
        question: "Where do you sit in the classroom?",
        options: ["Desk", "Chair", "Bookshelf", "Door"],
        answer: "Chair"
    },
    {
        question: "What do you use to cut paper?",
        options: ["Pencil", "Scissors", "Glue", "Stapler"],
        answer: "Scissors"
    },
    {
        question: "Which object tells time?",
        options: ["Phone", "Clock", "Calculator", "Lamp"],
        answer: "Clock"
    },

    // Emotions (5 questions)
    {
        question: "Which word means the opposite of 'happy'?",
        options: ["Joyful", "Sad", "Excited", "Laugh"],
        answer: "Sad"
    },
    {
        question: "How do you feel when you get a present?",
        options: ["Angry", "Happy", "Sleepy", "Hungry"],
        answer: "Happy"
    },
    {
        question: "How do you feel when you lose something?",
        options: ["Sad", "Excited", "Hungry", "Brave"],
        answer: "Sad"
    },
    {
        question: "How do you feel before a test?",
        options: ["Sleepy", "Nervous", "Hungry", "Cold"],
        answer: "Nervous"
    },
    {
        question: "How do you feel when you're very tired?",
        options: ["Sleepy", "Hungry", "Angry", "Cold"],
        answer: "Sleepy"
    },

    // Places (5 questions)
    {
        question: "What do you call this place?",
        image: "https://cdn.pixabay.com/photo/2013/07/12/12/56/school-146114_640.png",
        options: ["Hospital", "School", "Park", "Store"],
        answer: "School"
    },
    {
        question: "Where do you go when you're sick?",
        options: ["School", "Hospital", "Park", "Library"],
        answer: "Hospital"
    },
    {
        question: "Where do you buy food?",
        options: ["School", "Library", "Supermarket", "Park"],
        answer: "Supermarket"
    },
    {
        question: "Where do you play on swings and slides?",
        options: ["School", "Park", "Library", "Home"],
        answer: "Park"
    },
    {
        question: "Where do you borrow books?",
        options: ["Library", "School", "Hospital", "Zoo"],
        answer: "Library"
    }
];


// Initialize the game
function initGame() {
    startTime = new Date();
    totalQuestionsText.textContent = totalQuestions;
    
    // Shuffle questions and select the first 'totalQuestions'
    questions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
    
    showQuestion();
}

// Display current question
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    
    questionElement.textContent = currentQuestion.question;
    speak(currentQuestion.question);
    
    // Show image if available
    if (currentQuestion.image) {
        questionImageElement.src = currentQuestion.image;
        questionImageElement.alt = currentQuestion.answer;
        questionImageElement.classList.remove('d-none');
    } else {
        questionImageElement.classList.add('d-none');
    }
    
    // Shuffle options
    const shuffledOptions = [...currentQuestion.options].sort(() => 0.5 - Math.random());
    
    // Create option buttons
    shuffledOptions.forEach(option => {
        const button = document.createElement('div');
        button.classList.add('col-md-6');
        button.innerHTML = `
            <button class="btn btn-light option-btn w-100 click-to-speak" data-answer="${option}">
                ${option}
            </button>
        `;
        optionsContainer.appendChild(button);
    });
    
    // Update progress
    const progress = ((currentQuestionIndex) / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = Math.round(progress);
    currentQuestionText.textContent = currentQuestionIndex + 1;
}

// Reset question state
function resetState() {
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
    
    feedbackCorrect.classList.add('d-none');
    feedbackWrong.classList.add('d-none');
    nextButton.classList.add('d-none');
}

// Select answer
function selectAnswer(e) {
    if (!e.target.classList.contains('option-btn')) return;
    
    const selectedButton = e.target;
    const answer = selectedButton.dataset.answer;
    const currentQuestion = questions[currentQuestionIndex];
    
    // Disable all options
    document.querySelectorAll('.option-btn').forEach(button => {
        button.disabled = true;
    });
    
    if (answer === currentQuestion.answer) {
        selectedButton.classList.remove('btn-light');
        selectedButton.classList.add('btn-success');
        feedbackCorrect.classList.remove('d-none');
        playGameAudio('audio-true');
        score++;
    } else {
        selectedButton.classList.remove('btn-light');
        selectedButton.classList.add('btn-danger');
        feedbackWrong.classList.remove('d-none');
        playGameAudio('audio-false');
        
        // Highlight correct answer
        document.querySelectorAll('.option-btn').forEach(button => {
            if (button.dataset.answer === currentQuestion.answer) {
                button.classList.remove('btn-light');
                button.classList.add('btn-success');
            }
        });
    }
    
    nextButton.classList.remove('d-none');
}

// Show next question or end game
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < totalQuestions) {
        showQuestion();
    } else {
        endGame();
    }
}

// End game
function endGame() {
    const endTime = new Date();
    const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
    
    // Calculate final score (0-100)
    const finalScore = Math.round((score / totalQuestions) * 100);
    
    // Show results
    questionElement.textContent = `Game Over! Your score: ${finalScore}%`;
    questionImageElement.classList.add('d-none');
    optionsContainer.innerHTML = `
        <div class="col-12 text-center">
            <div class="card p-4">
                <h3 class="text-primary">Results</h3>
                <p class="fs-4">You got ${score} out of ${totalQuestions} correct!</p>
                <p>Time spent: ${timeSpent} seconds</p>
                <button class="btn btn-primary mt-3" onclick="initGame()">
                    <i class="fas fa-redo me-2"></i> Play Again
                </button>
            </div>
        </div>
    `;
    
    // Speak results
    speak(`Game Over! Your score is ${finalScore} percent. You got ${score} out of ${totalQuestions} correct. Time spent: ${timeSpent} seconds.`);
}

// Event listeners
optionsContainer.addEventListener('click', selectAnswer);
nextButton.addEventListener('click', nextQuestion);

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);