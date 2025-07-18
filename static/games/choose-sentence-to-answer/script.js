const questions = [
    {
        question: "What color is the sky on a sunny day?",
        options: [
            "The sky is green when the sun shines brightly.",
            "The sky is blue when the weather is sunny."
        ],
        correct: 1
    },
    {
        question: "How many legs does a cat have?",
        options: [
            "Cats have two legs just like humans.",
            "Cats have four legs to help them walk and run."
        ],
        correct: 1
    },
    {
        question: "Which animal makes a 'moo' sound?",
        options: [
            "Dogs make a 'moo' sound when they are happy.",
            "Cows make a 'moo' sound on the farm."
        ],
        correct: 1
    },
    {
        question: "What do we use to see things around us?",
        options: [
            "We use our eyes to see the beautiful world.",
            "We use our ears to see different colors."
        ],
        correct: 0
    },
    {
        question: "Which animal is bigger, an elephant or a mouse?",
        options: [
            "An elephant is much bigger than a small mouse.",
            "A mouse is bigger than an elephant in the zoo."
        ],
        correct: 0
    },
    {
        question: "What do you wear on your feet when you go outside?",
        options: [
            "People wear gloves on their feet to keep warm.",
            "We wear shoes on our feet to protect them."
        ],
        correct: 1
    },
    {
        question: "Which fruit is yellow and has a curved shape?",
        options: [
            "Apples are yellow fruits that grow on trees.",
            "Bananas are yellow and have a nice curved shape."
        ],
        correct: 1
    },
    {
        question: "Where do fish usually live?",
        options: [
            "Fish live in trees with birds and squirrels.",
            "Fish live in water like rivers, lakes, and oceans."
        ],
        correct: 1
    },
    {
        question: "What do we use to write on paper?",
        options: [
            "We use a spoon to write letters to friends.",
            "We use a pencil to write words in our notebook."
        ],
        correct: 1
    },
    {
        question: "Which animal can fly in the sky?",
        options: [
            "Birds can fly high up in the blue sky.",
            "Dogs can fly like airplanes in the clouds."
        ],
        correct: 0
    },
    {
        question: "What should you drink when you feel thirsty?",
        options: [
            "Water is the best drink when you're thirsty.",
            "Sand can help you when you need a drink."
        ],
        correct: 0
    },
    {
        question: "Which one is hot, ice or fire?",
        options: [
            "Ice is very hot and can burn your fingers.",
            "Fire is hot and can warm you in winter."
        ],
        correct: 1
    },
    {
        question: "What do plants need to grow healthy and strong?",
        options: [
            "Plants need sunlight to grow big and green.",
            "Plants grow best in complete darkness."
        ],
        correct: 0
    },
    {
        question: "Which month comes right after April?",
        options: [
            "March comes after April in the calendar.",
            "May is the month that follows April."
        ],
        correct: 1
    },
    {
        question: "What do you call a baby dog?",
        options: [
            "A kitten is what we call a baby dog.",
            "A puppy is the name for a baby dog."
        ],
        correct: 1
    },
    {
        question: "Which shape is round like a ball?",
        options: [
            "A circle is perfectly round like a ball.",
            "A square has round corners like a ball."
        ],
        correct: 0
    },
    {
        question: "Where do children go to learn new things?",
        options: [
            "Children go to school to learn and play.",
            "The supermarket is where we learn math."
        ],
        correct: 0
    },
    {
        question: "Which food tastes sweet, candy or lemon?",
        options: [
            "Candy tastes sweet and makes us happy.",
            "Lemons are very sweet like chocolate."
        ],
        correct: 0
    },
    {
        question: "What do you use to cut a piece of paper?",
        options: [
            "Scissors are used to cut paper safely.",
            "Glue can help you cut paper neatly."
        ],
        correct: 0
    },
    {
        question: "Which season is usually the coldest?",
        options: [
            "Summer is the coldest season of the year.",
            "Winter is when we feel the coldest weather."
        ],
        correct: 1
    },
    {
        question: "What do you call the king of the jungle?",
        options: [
            "The lion is known as the jungle king.",
            "Giraffes rule over all the jungle animals."
        ],
        correct: 0
    },
    {
        question: "Which vehicle is faster, a car or a bicycle?",
        options: [
            "Cars can go much faster than bicycles.",
            "Bicycles are faster than racing cars."
        ],
        correct: 0
    },
    {
        question: "What do you put on bread to make a sandwich?",
        options: [
            "We spread butter on bread for sandwiches.",
            "Water makes bread tasty for sandwiches."
        ],
        correct: 0
    },
    {
        question: "Which is bigger, the sun or the moon?",
        options: [
            "The sun is much bigger than the moon.",
            "The moon is bigger than the bright sun."
        ],
        correct: 0
    },
    {
        question: "What should you wear when it's raining outside?",
        options: [
            "Sunglasses protect us from the rain.",
            "A raincoat keeps you dry in the rain."
        ],
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
