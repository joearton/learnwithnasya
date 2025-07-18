const questions = [
    {
        question: "What color is the sky on a sunny day?",
        options: ["Green", "Blue"],
        correct: 1
    },
    {
        question: "How many legs does a cat have?",
        options: ["Two", "Four"],
        correct: 1
    },
    {
        question: "Which animal says 'moo'?",
        options: ["Dog", "Cow"],
        correct: 1
    },
    {
        question: "What do we use to see?",
        options: ["Eyes", "Ears"],
        correct: 0
    },
    {
        question: "Which is bigger: an elephant or a mouse?",
        options: ["Elephant", "Mouse"],
        correct: 0
    },
    {
        question: "What do you wear on your feet?",
        options: ["Gloves", "Shoes"],
        correct: 1
    },
    {
        question: "Which fruit is yellow and curved?",
        options: ["Apple", "Banana"],
        correct: 1
    },
    {
        question: "Where do fish live?",
        options: ["In trees", "In water"],
        correct: 1
    },
    {
        question: "What do we use to write?",
        options: ["A spoon", "A pencil"],
        correct: 1
    },
    {
        question: "Which one can fly?",
        options: ["A bird", "A dog"],
        correct: 0
    },
    {
        question: "What do you drink when you're thirsty?",
        options: ["Water", "Sand"],
        correct: 0
    },
    {
        question: "Which is hot: ice or fire?",
        options: ["Ice", "Fire"],
        correct: 1
    },
    {
        question: "What do plants need to grow?",
        options: ["Sunlight", "Darkness"],
        correct: 0
    },
    {
        question: "Which month comes after April?",
        options: ["March", "May"],
        correct: 1
    },
    {
        question: "What do you call a baby dog?",
        options: ["Kitten", "Puppy"],
        correct: 1
    },
    {
        question: "Which shape is round like a ball?",
        options: ["Circle", "Square"],
        correct: 0
    },
    {
        question: "Where do you go to learn?",
        options: ["School", "Supermarket"],
        correct: 0
    },
    {
        question: "Which is sweet: candy or lemon?",
        options: ["Candy", "Lemon"],
        correct: 0
    },
    {
        question: "What do you use to cut paper?",
        options: ["Scissors", "Glue"],
        correct: 0
    },
    {
        question: "Which season is the coldest?",
        options: ["Summer", "Winter"],
        correct: 1
    },
    {
        question: "What do you call the king of the jungle?",
        options: ["Lion", "Giraffe"],
        correct: 0
    },
    {
        question: "Which is faster: a car or a bicycle?",
        options: ["Car", "Bicycle"],
        correct: 0
    },
    {
        question: "What do you put on bread?",
        options: ["Butter", "Water"],
        correct: 0
    },
    {
        question: "Which is bigger: the sun or the moon?",
        options: ["Sun", "Moon"],
        correct: 0
    },
    {
        question: "What do you wear when it rains?",
        options: ["Sunglasses", "Raincoat"],
        correct: 1
    }
];

const questionDisplay = document.getElementById('questionDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const nextButton = document.getElementById('nextButton');
const counterDisplay = document.getElementById('counter');
const scoreDisplay = document.getElementById('score');

let remainingQuestions = [...questions];
let currentQuestion = null;
let score = 0;
let selectedOption = null;

function getRandomQuestion() {
    if (remainingQuestions.length === 0) {
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const selectedQuestion = remainingQuestions[randomIndex];
    
    // Remove the selected question from the array
    remainingQuestions.splice(randomIndex, 1);
    
    return selectedQuestion;
}

function displayQuestion() {
    currentQuestion = getRandomQuestion();
    
    if (!currentQuestion) {
        questionDisplay.textContent = "Quiz completed! Well done!";
        optionsContainer.innerHTML = "";
        nextButton.disabled = true;
        return;
    }
    
    // Add animation
    questionDisplay.classList.add('animate');
    
    // Show "loading" message during animation
    questionDisplay.textContent = "Loading next question...";
    optionsContainer.innerHTML = "";
    
    // After animation, show the question
    setTimeout(() => {
        questionDisplay.textContent = currentQuestion.question;
        questionDisplay.classList.remove('animate');
        
        // Create option buttons
        currentQuestion.options.forEach((option, index) => {
            const optionButton = document.createElement('div');
            optionButton.className = 'option';
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionButton);
        });
        
        updateCounter();
    }, 500);
}

function selectOption(index) {
    if (selectedOption !== null) return;
    
    selectedOption = index;
    const optionElements = document.querySelectorAll('.option');
    
    optionElements.forEach((el, i) => {
        if (i === currentQuestion.correct) {
            el.classList.add('correct');
        }
        if (i === index && i !== currentQuestion.correct) {
            el.classList.add('incorrect');
        }
    });
    
    if (index === currentQuestion.correct) {
        playGameAudio('game-audio-true');
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        playGameAudio('game-audio-false');
    }
    
    nextButton.disabled = false;
}

function updateCounter() {
    counterDisplay.textContent = `Questions left: ${remainingQuestions.length}`;
    nextButton.disabled = true;
    selectedOption = null;
}

nextButton.addEventListener('click', displayQuestion);

// Start the quiz
displayQuestion();

