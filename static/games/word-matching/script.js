// Word database
// Word database for children
const words = [
    { word: "Happy", definition: "Feeling joy or pleasure" },
    { word: "Sad", definition: "Feeling unhappy or sorry" },
    { word: "Big", definition: "Large in size" },
    { word: "Small", definition: "Little in size" },
    { word: "Fast", definition: "Moving quickly" },
    { word: "Slow", definition: "Moving at low speed" },
    { word: "Hot", definition: "Having high temperature" },
    { word: "Cold", definition: "Having low temperature" },
    { word: "Wet", definition: "Covered with water or liquid" },
    { word: "Dry", definition: "Without water or moisture" },
    { word: "Clean", definition: "Not dirty" },
    { word: "Dirty", definition: "Not clean" },
    { word: "Light", definition: "Not heavy" },
    { word: "Heavy", definition: "Having great weight" },
    { word: "Old", definition: "Having lived for many years" },
    { word: "New", definition: "Recently made or created" },
    { word: "Tall", definition: "Of great height" },
    { word: "Short", definition: "Of little height" },
    { word: "Kind", definition: "Friendly and helpful" },
    { word: "Mean", definition: "Not nice to others" },
    { word: "Brave", definition: "Not afraid of danger" },
    { word: "Scared", definition: "Feeling afraid" },
    { word: "Loud", definition: "Making much noise" },
    { word: "Quiet", definition: "Making little noise" },
    { word: "Bright", definition: "Giving much light" },
    { word: "Dark", definition: "With little or no light" },
    { word: "Soft", definition: "Easy to press or bend" },
    { word: "Hard", definition: "Not easy to bend or break" },
    { word: "Full", definition: "Containing as much as possible" },
    { word: "Empty", definition: "Containing nothing" }
];

// The rest of your game code remains the same...
// Game variables
let currentWordIndex = 0;
let score = 0;
let wordsLeft = words.length;
const totalWords = words.length;

// DOM elements
const wordDisplay = document.getElementById('wordDisplay');
const definitionsContainer = document.getElementById('definitionsContainer');
const checkButton = document.getElementById('checkButton');
const feedback = document.getElementById('feedback');
const counter = document.getElementById('counter');
const scoreDisplay = document.getElementById('score');

// Initialize game
function initGame() {
    displayWord();
    displayDefinitions();
    updateCounter();
    updateScore();
    
    checkButton.addEventListener('click', checkAnswer);
}

// Display current word
function displayWord() {
    wordDisplay.textContent = words[currentWordIndex].word;
}

// Display shuffled definitions
function displayDefinitions() {
    definitionsContainer.innerHTML = '';
    
    // Get all definitions including the correct one
    let allDefinitions = words.map(w => w.definition);
    
    // Shuffle and take 4 (including correct answer)
    allDefinitions = shuffleArray(allDefinitions).slice(0, 4);
    
    // If correct answer isn't in the selection, replace one
    if (!allDefinitions.includes(words[currentWordIndex].definition)) {
        allDefinitions[0] = words[currentWordIndex].definition;
        allDefinitions = shuffleArray(allDefinitions);
    }
    
    // Create buttons for each definition
    allDefinitions.forEach(def => {
        const button = document.createElement('button');
        button.textContent = def;
        button.classList.add('definition-option');
        definitionsContainer.appendChild(button);
    });
    
    // Add click event to definition buttons
    document.querySelectorAll('.definition-option').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.definition-option').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
}

// Check selected answer
function checkAnswer() {
    const selectedButton = document.querySelector('.definition-option.selected');
    
    if (!selectedButton) {
        feedback.textContent = "Please select an answer!";
        feedback.style.color = "red";
        return;
    }
    
    if (selectedButton.textContent === words[currentWordIndex].definition) {
        feedback.textContent = "Correct! Well done!";
        feedback.style.color = "green";
        playGameAudio('game-audio-true');
        score++;
    } else {
        feedback.textContent = `Incorrect. The correct definition is: ${words[currentWordIndex].definition}`;
        feedback.style.color = "red";
        playGameAudio('game-audio-false');
    }
    
    updateScore();
    nextWord();
}

// Move to next word
function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    wordsLeft--;
    
    if (wordsLeft <= 0) {
        endGame();
        return;
    }
    
    updateCounter();
    displayWord();
    displayDefinitions();
}

// End game
function endGame() {
    wordDisplay.textContent = `Game Over! Final Score: ${score}/${totalWords}`;
    definitionsContainer.innerHTML = '';
    checkButton.disabled = true;
    feedback.textContent = "Refresh to play again!";
}

// Helper function to shuffle array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Update counter display
function updateCounter() {
    counter.textContent = `Words left: ${wordsLeft}`;
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Start game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);