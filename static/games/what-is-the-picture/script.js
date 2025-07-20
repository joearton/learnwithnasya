// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Game variables
    let currentQuestion = 0;
    let score = 0;
    let startTime;
    let timerInterval;
    let questions = [];
    
    // DOM elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const questionImage = document.getElementById('question-image');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const timerElement = document.getElementById('timer');
    const finalScore = document.getElementById('final-score');
    const finalTime = document.getElementById('final-time');
    const correctAnswers = document.getElementById('correct-answers');
    const totalQuestions = document.getElementById('total-questions');

    // Questions data - in a real app, you might fetch this from an API
    const questionData = [
        {
            image: "https://cdn.pixabay.com/photo/2016/09/29/08/33/apple-1702316_1280.jpg",
            correctAnswer: "Apple",
            options: ["Apple", "Banana", "Orange", "Grapes"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2016/05/18/10/52/buick-1400243_1280.jpg",
            correctAnswer: "Car",
            options: ["Bus", "Car", "Bicycle", "Train"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2016/01/05/17/51/maltese-1123016_1280.jpg",
            correctAnswer: "Dog",
            options: ["Cat", "Dog", "Rabbit", "Bird"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271_1280.jpg",
            correctAnswer: "House",
            options: ["House", "School", "Hospital", "Shop"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2015/05/29/23/39/sunset-789974_1280.jpg",
            correctAnswer: "Sun",
            options: ["Moon", "Star", "Sun", "Cloud"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2020/06/01/08/46/water-5245722_1280.jpg",
            correctAnswer: "Water",
            options: ["Fire", "Water", "Earth", "Air"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2021/01/21/15/54/books-5937716_1280.jpg",
            correctAnswer: "Book",
            options: ["Book", "Pen", "Pencil", "Notebook"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2021/03/08/12/06/oxford-shoes-6078951_1280.jpg",
            correctAnswer: "Shoes",
            options: ["Shoes", "Socks", "Hat", "Gloves"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2018/04/06/23/43/poultry-3297369_1280.jpg",
            correctAnswer: "Chicken",
            options: ["Duck", "Chicken", "Turkey", "Eagle"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2017/06/24/22/34/smiley-2439147_1280.jpg",
            correctAnswer: "Happy",
            options: ["Sad", "Angry", "Happy", "Surprised"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2016/12/27/21/03/lone-tree-1934897_1280.jpg",
            correctAnswer: "Tree",
            options: ["Tree", "Bush", "Flower", "Grass"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2023/12/15/21/47/cat-8451431_1280.jpg",
            correctAnswer: "Cat",
            options: ["Cat", "Dog", "Rabbit", "Bird"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2014/12/01/19/23/pink-553149_1280.jpg",
            correctAnswer: "Gift",
            options: ["Gift", "Bag", "Box", "Book"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2018/06/11/23/15/basketball-3469628_1280.jpg",
            correctAnswer: "Ball",
            options: ["Ball", "Globe", "Circle", "Moon"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2021/08/13/07/11/siamese-fighting-fish-6542427_1280.jpg",
            correctAnswer: "Fish",
            options: ["Fish", "Shark", "Dolphin", "Octopus"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2021/08/23/14/48/western-hat-6567973_1280.jpg",
            correctAnswer: "Hat",
            options: ["Hat", "Cap", "Helmet", "Crown"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2016/11/25/23/15/moon-1859616_1280.jpg",
            correctAnswer: "Moon",
            options: ["Star", "Planet", "Moon", "Sun"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2016/02/07/21/16/shrub-1185665_1280.jpg",
            correctAnswer: "Banana",
            options: ["Apple", "Banana", "Lemon", "Melon"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2017/01/20/15/06/oranges-1995056_1280.jpg",
            correctAnswer: "Orange",
            options: ["Grapes", "Apple", "Orange", "Carrot"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2019/11/23/11/33/mobile-phone-4646854_1280.jpg",
            correctAnswer: "Phone",
            options: ["Phone", "Camera", "TV", "Remote"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2022/04/26/13/04/sky-7158340_1280.jpg",
            correctAnswer: "Cloud",
            options: ["Cloud", "Smoke", "Fog", "Sky"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2021/01/05/05/30/grapes-5889697_1280.jpg",
            correctAnswer: "Grapes",
            options: ["Grapes", "Plum", "Cherry", "Strawberry"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2015/05/21/10/34/bus-776945_1280.jpg",
            correctAnswer: "Bus",
            options: ["Car", "Bus", "Train", "Bike"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2017/02/24/02/37/classroom-2093744_1280.jpg",
            correctAnswer: "School",
            options: ["School", "Office", "Shop", "House"]
        },
        {
            image: "https://cdn.pixabay.com/photo/2025/02/14/13/46/crested-tit-9406740_1280.jpg",
            correctAnswer: "Bird",
            options: ["Cat", "Chicken", "Bird", "Rabbit"]
        }
    ];

    
    // Shuffle array function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Start game
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    function startGame() {
        // Shuffle questions and options
        questions = shuffleArray([...questionData]);
        questions.forEach(q => {
            q.options = shuffleArray([...q.options]);
        });

        currentQuestion = 0;
        score = 0;
        startScreen.classList.add('d-none');
        resultScreen.classList.add('d-none');
        gameScreen.classList.remove('d-none');

        // Start timer
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
        updateTimer();

        loadQuestion();
    }

    // Update timer
    function updateTimer() {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
        const seconds = (elapsedTime % 60).toString().padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }

    // Load question
    function loadQuestion() {
        if (currentQuestion >= questions.length) {
            endGame();
            return;
        }

        const question = questions[currentQuestion];
        questionImage.src = question.image;
        questionImage.alt = question.correctAnswer;
        questionText.textContent = "What is this?";

        // Update progress
        progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
        progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

        // Create options
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-6';

            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-primary w-100 py-3 click-to-speak';
            btn.textContent = option;
            btn.onclick = () => checkAnswer(option, question.correctAnswer);

            col.appendChild(btn);
            optionsContainer.appendChild(col);
        });
    }

    // Check answer
    function checkAnswer(selectedOption, correctAnswer) {
        const optionButtons = document.querySelectorAll('#options-container button');
        
        // Disable all buttons
        optionButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('btn-outline-primary');
            
            if (btn.textContent === correctAnswer) {
                btn.classList.add('btn-success');
            } else if (btn.textContent === selectedOption && selectedOption !== correctAnswer) {
                btn.classList.add('btn-danger');
            }
        });

        // Check if correct
        if (selectedOption === correctAnswer) {
            score += 1;
            playGameAudio('audio-true');
        } else {
            playGameAudio('audio-false');
        }

        // Move to next question after delay
        setTimeout(() => {
            currentQuestion++;
            loadQuestion();
        }, 1500);
    }

    // End game
    function endGame() {
        clearInterval(timerInterval);
        
        // Calculate final score (scaled to 100)
        const finalScoreValue = Math.round((score / questions.length) * 100);
        
        finalScore.textContent = finalScoreValue;
        correctAnswers.textContent = score;
        totalQuestions.textContent = questions.length;
        finalTime.textContent = timerElement.textContent;
        
        gameScreen.classList.add('d-none');
        resultScreen.classList.remove('d-none');
    }
});