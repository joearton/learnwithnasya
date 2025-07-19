// Game data
// Game data
const sentences = [
    // Present Simple
    { sentence: "I ___ to school every morning.", answer: "go", options: ["go", "went", "going", "gone"] },
    { sentence: "She ___ a beautiful song yesterday.", answer: "sang", options: ["sings", "sang", "singing", "sung"] },
    { sentence: "We ___ playing football in the park.", answer: "are", options: ["is", "am", "are", "be"] },
    { sentence: "My favorite color ___ blue.", answer: "is", options: ["are", "is", "am", "be"] },
    { sentence: "They ___ three cats and a dog.", answer: "have", options: ["has", "have", "had", "having"] },
    
    // Daily Activities
    { sentence: "Please ___ the window, it's cold.", answer: "close", options: ["close", "closes", "closed", "closing"] },
    { sentence: "He can ___ very fast.", answer: "run", options: ["ran", "run", "running", "runs"] },
    { sentence: "We ___ our homework last night.", answer: "did", options: ["do", "does", "did", "doing"] },
    { sentence: "The sun ___ in the east.", answer: "rises", options: ["rise", "rises", "rose", "rising"] },
    { sentence: "I ___ hungry. Let's eat something.", answer: "am", options: ["is", "am", "are", "be"] },
    
    // Past Simple
    { sentence: "Yesterday, we ___ to the zoo.", answer: "went", options: ["go", "goes", "went", "going"] },
    { sentence: "She ___ a delicious cake for my birthday.", answer: "baked", options: ["bakes", "baking", "baked", "bake"] },
    { sentence: "They ___ TV all evening yesterday.", answer: "watched", options: ["watch", "watches", "watched", "watching"] },
    { sentence: "He ___ his keys at home this morning.", answer: "left", options: ["leave", "leaves", "left", "leaving"] },
    { sentence: "We ___ late for school last Monday.", answer: "were", options: ["was", "were", "are", "be"] },
    
    // Future Tense
    { sentence: "I ___ visit my grandparents tomorrow.", answer: "will", options: ["will", "am", "going", "want"] },
    { sentence: "They ___ to London next month.", answer: "are moving", options: ["moves", "move", "are moving", "moved"] },
    { sentence: "She ___ a doctor when she grows up.", answer: "will be", options: ["is", "will be", "was", "being"] },
    { sentence: "We ___ dinner at 7 PM tonight.", answer: "are having", options: ["have", "has", "are having", "had"] },
    { sentence: "___ you help me with this later?", answer: "Will", options: ["Do", "Are", "Will", "Would"] },
    
    // Present Continuous
    { sentence: "Look! The baby ___ now.", answer: "is sleeping", options: ["sleeps", "is sleeping", "sleep", "slept"] },
    { sentence: "They ___ football in the park.", answer: "are playing", options: ["play", "plays", "are playing", "played"] },
    { sentence: "I ___ for my English test right now.", answer: "am studying", options: ["study", "studies", "am studying", "studied"] },
    { sentence: "Why ___ you ___ at me?", answer: "are looking", options: ["do look", "are looking", "is looking", "look"] },
    { sentence: "She ___ her hair at the moment.", answer: "is washing", options: ["washes", "wash", "is washing", "washed"] },
    
    // Adjectives
    { sentence: "This is the ___ book I've ever read!", answer: "most interesting", options: ["interesting", "more interesting", "most interesting", "interestinger"] },
    { sentence: "My brother is ___ than me.", answer: "taller", options: ["tall", "taller", "tallest", "more tall"] },
    { sentence: "The weather is ___ today than yesterday.", answer: "better", options: ["good", "well", "better", "best"] },
    { sentence: "This exercise is ___ than the last one.", answer: "easier", options: ["easy", "easier", "easiest", "more easy"] },
    { sentence: "That was the ___ movie I've ever seen!", answer: "worst", options: ["bad", "worse", "worst", "baddest"] }
];


// Game state
let currentQuestion = 0;
let score = 0;
let selectedOption = null;

// DOM elements
const sentenceDisplay = document.getElementById('sentenceDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const checkButton = document.getElementById('checkButton');
const nextButton = document.getElementById('nextButton');
const feedback = document.getElementById('feedback');
const counter = document.getElementById('counter');
const scoreDisplay = document.getElementById('score');

// Initialize game
function initGame() {
    displayQuestion();
    
    checkButton.addEventListener('click', checkAnswer);
    nextButton.addEventListener('click', nextQuestion);
}

// Display current question
function displayQuestion() {
    const question = sentences[currentQuestion];
    sentenceDisplay.textContent = question.sentence;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary m-1';
        button.textContent = option;
        button.dataset.option = option;
        button.addEventListener('click', () => selectOption(button));
        optionsContainer.appendChild(button);
    });
    
    updateProgress();
    feedback.style.display = 'none';
    nextButton.disabled = true;
    selectedOption = null;
}

// Select an option
function selectOption(button) {
    document.querySelectorAll('#optionsContainer button').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
    });
    
    button.classList.remove('btn-outline-primary');
    button.classList.add('btn-primary');
    selectedOption = button.dataset.option;
}

// Check answer
function checkAnswer() {
    if (!selectedOption) {
        showFeedback('Please select an answer!', 'warning');
        return;
    }
    
    const question = sentences[currentQuestion];
    if (selectedOption === question.answer) {
        score++;
        playGameAudio('game-audio-true');
        showFeedback('Correct! Well done!', 'success');
    } else {
        playGameAudio('game-audio-false');
        showFeedback(`Incorrect. The correct answer is "${question.answer}".`, 'danger');
    }
    
    updateScore();
    nextButton.disabled = false;
    checkButton.disabled = true;
}

// Show feedback message
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `alert alert-${type}`;
    feedback.style.display = 'block';
}

// Move to next question
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= sentences.length) {
        endGame();
        return;
    }
    
    displayQuestion();
    checkButton.disabled = false;
}

// End game
function endGame() {
    sentenceDisplay.textContent = `Game Over! Your score: ${score}/${sentences.length}`;
    optionsContainer.innerHTML = '';
    checkButton.style.display = 'none';
    nextButton.style.display = 'none';
    feedback.textContent = "Refresh to play again!";
    feedback.className = "alert alert-info";
    feedback.style.display = 'block';
}

// Update progress counter
function updateProgress() {
    counter.textContent = `Question: ${currentQuestion + 1}/${sentences.length}`;
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Start game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);