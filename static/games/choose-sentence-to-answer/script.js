document.addEventListener('DOMContentLoaded', function() {
    // Game configuration
    const questions = [
        {
            question: "How are you today?",
            options: [
                "I'm fine, thank you.",
                "I have two brothers.",
                "My favorite color is blue.",
                "I am seven years old."
            ],
            correctAnswer: 0
        },
        {
            question: "What's your favorite color?",
            options: [
                "I like to play soccer.",
                "My favorite color is green.",
                "I have a dog.",
                "I'm hungry."
            ],
            correctAnswer: 1
        },
        {
            question: "How old are you?",
            options: [
                "I live in a big house.",
                "My name is Anna.",
                "I am eight years old.",
                "I like ice cream."
            ],
            correctAnswer: 2
        },
        {
            question: "Where do you live?",
            options: [
                "I live in Jakarta.",
                "I'm playing a game.",
                "My favorite animal is a dog.",
                "I'm eating lunch."
            ],
            correctAnswer: 0
        },
        {
            question: "What do you like to eat?",
            options: [
                "I like pizza.",
                "I ride my bike.",
                "I live with my parents.",
                "My shoes are red."
            ],
            correctAnswer: 0
        },
        {
            question: "What animal do you like?",
            options: [
                "I go to school.",
                "My dog is big.",
                "I like elephants.",
                "I'm going to bed."
            ],
            correctAnswer: 2
        },
        {
            question: "Can you swim?",
            options: [
                "Yes, I can swim.",
                "I have a red shirt.",
                "I like to eat cookies.",
                "My brother is tall."
            ],
            correctAnswer: 0
        },
        {
            question: "What do you do in the morning?",
            options: [
                "I brush my teeth.",
                "I watch TV at night.",
                "I sleep at 9 o'clock.",
                "I eat dinner with my family."
            ],
            correctAnswer: 0
        },
        {
            question: "What color is the sky?",
            options: [
                "The sky is blue.",
                "I like to sing.",
                "My room is clean.",
                "I have a new toy."
            ],
            correctAnswer: 0
        },
        {
            question: "Do you have any brothers or sisters?",
            options: [
                "Yes, I have one brother.",
                "I like ice cream.",
                "My shoes are new.",
                "I go to the park."
            ],
            correctAnswer: 0
        },
        {
            question: "What do you do after school?",
            options: [
                "I do my homework.",
                "I eat breakfast.",
                "I go to sleep.",
                "I take a shower."
            ],
            correctAnswer: 0
        },
        {
            question: "What is your favorite food?",
            options: [
                "I play with my friends.",
                "My favorite food is spaghetti.",
                "I go to the zoo.",
                "I sleep in my bed."
            ],
            correctAnswer: 1
        },
        {
            question: "What do you do on the weekend?",
            options: [
                "I play with my friends.",
                "I do my homework at school.",
                "I go to bed early.",
                "I eat lunch at 12."
            ],
            correctAnswer: 0
        },
        {
            question: "What time do you wake up?",
            options: [
                "I wake up at 6 o'clock.",
                "I go to school.",
                "My dog barks a lot.",
                "I eat cake."
            ],
            correctAnswer: 0
        },
        {
            question: "Do you like music?",
            options: [
                "Yes, I like music.",
                "My name is Lisa.",
                "I have a pencil.",
                "The sun is hot."
            ],
            correctAnswer: 0
        },
        {
            question: "What is your favorite sport?",
            options: [
                "My favorite sport is basketball.",
                "I eat rice every day.",
                "I live near a beach.",
                "I like drawing."
            ],
            correctAnswer: 0
        },
        {
            question: "What do you see in the zoo?",
            options: [
                "I see lions and monkeys.",
                "I eat popcorn.",
                "I sleep in the afternoon.",
                "My friend is tall."
            ],
            correctAnswer: 0
        },
        {
            question: "Do you like reading books?",
            options: [
                "Yes, I like reading books.",
                "I wash my hands.",
                "I drink water.",
                "The car is blue."
            ],
            correctAnswer: 0
        },
        {
            question: "What do you do before sleeping?",
            options: [
                "I brush my teeth before sleeping.",
                "I play soccer.",
                "I eat lunch.",
                "I go to school."
            ],
            correctAnswer: 0
        },
        {
            question: "Do you like drawing?",
            options: [
                "Yes, I like drawing.",
                "I take a bath.",
                "I go shopping.",
                "The sky is gray."
            ],
            correctAnswer: 0
        },
        {
            question: "What do you do when you are happy?",
            options: [
                "I smile and laugh.",
                "I cry a lot.",
                "I go to sleep.",
                "I eat bananas."
            ],
            correctAnswer: 0
        },
        {
            question: "What day is it today?",
            options: [
                "Today is Monday.",
                "I like chocolate.",
                "I wear a hat.",
                "I live in a city."
            ],
            correctAnswer: 0
        },
        {
            question: "What do you wear when it's cold?",
            options: [
                "I wear a jacket.",
                "I eat soup.",
                "I drink juice.",
                "I watch TV."
            ],
            correctAnswer: 0
        },
        {
            question: "What color is your hair?",
            options: [
                "My hair is black.",
                "I go to the beach.",
                "I love watermelon.",
                "I have a pencil case."
            ],
            correctAnswer: 0
        },
        {
            question: "Where do you go to study?",
            options: [
                "I go to school to study.",
                "I play video games.",
                "I run fast.",
                "I eat in the kitchen."
            ],
            correctAnswer: 0
        },
        {
            question: "What sound does a dog make?",
            options: [
                "A dog says woof.",
                "A cat says meow.",
                "A cow says moo.",
                "A bird sings."
            ],
            correctAnswer: 0
        },
        {
            question: "How do you feel when you're sick?",
            options: [
                "I feel bad when I’m sick.",
                "I jump and play.",
                "I laugh a lot.",
                "I go swimming."
            ],
            correctAnswer: 0
        },
        {
            question: "What do you see in the sky at night?",
            options: [
                "I see stars and the moon.",
                "I eat noodles.",
                "I go to the zoo.",
                "I see books."
            ],
            correctAnswer: 0
        },
        {
            question: "What fruit do you like?",
            options: [
                "I like bananas.",
                "I go to the market.",
                "I clean my room.",
                "I run in the park."
            ],
            correctAnswer: 0
        },
        {
            question: "What do you do in your free time?",
            options: [
                "I read books in my free time.",
                "I take medicine.",
                "I sleep in class.",
                "I drink tea."
            ],
            correctAnswer: 0
        }
    ];


    // Game variables
    let currentQuestionIndex = 0;
    let score = 0;
    let startTime;
    let timerInterval;
    const totalQuestions = questions.length;
    const pointsPerQuestion = Math.floor(100 / totalQuestions);

    // DOM elements
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const feedbackElement = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const nextButton = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentQuestionDisplay = document.getElementById('current-question');
    const totalQuestionsDisplay = document.getElementById('total-questions');


    // Initialize game
    function initGame() {
        currentQuestionIndex = 0;
        score = 0;
        startTime = new Date();
        totalQuestionsDisplay.textContent = totalQuestions; 
        
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
        updateScore();
        updateProgress();
        loadQuestion();
    }

    // Load question
    function loadQuestion() {
        if (currentQuestionIndex >= totalQuestions) {
            endGame();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        currentQuestionDisplay.textContent = currentQuestionIndex + 1;
        speak(currentQuestion.question);
        
        optionsContainer.innerHTML = '';
        
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn btn btn-outline-primary btn-lg py-3 click-to-speak';
            button.textContent = option;
            button.onclick = () => checkAnswer(index);
            optionsContainer.appendChild(button);
        });
        
        feedbackElement.textContent = '';
        feedbackElement.className = '';
        nextButton.classList.add('d-none');
    }

    // Check answer
    function checkAnswer(selectedIndex) {
        const currentQuestion = questions[currentQuestionIndex];
        const options = document.querySelectorAll('.option-btn');
        
        options.forEach(btn => btn.disabled = true);
        
        if (selectedIndex === currentQuestion.correctAnswer) {
            options[selectedIndex].className = 'option-btn btn btn-success btn-lg py-3';
            feedbackElement.textContent = 'Correct!';
            feedbackElement.className = 'text-success fw-bold';
            score += pointsPerQuestion;
            playGameAudio('audio-true');
        } else {
            options[selectedIndex].className = 'option-btn btn btn-danger btn-lg py-3';
            options[currentQuestion.correctAnswer].className = 'option-btn btn btn-success btn-lg py-3';
            feedbackElement.textContent = 'Oops! Try again.';
            feedbackElement.className = 'text-danger fw-bold';
            playGameAudio('audio-false');
        }
        
        speak(feedbackElement.textContent);
        updateScore();
        updateProgress();
        nextButton.classList.remove('d-none');
    }

    // Next question
    function nextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
    }

    // Update score
    function updateScore() {
        scoreElement.textContent = Math.min(score, 100);
    }

    // Update progress bar
    function updateProgress() {
        const progress = ((currentQuestionIndex) / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Update timer
    function updateTimer() {
        const currentTime = new Date();
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // End game
    function endGame() {
        clearInterval(timerInterval);
        const finalScore = Math.min(score, 100);
        
        questionElement.textContent = 'Game Completed!';
        optionsContainer.innerHTML = `
            <div class="text-center p-4">
                <div class="display-4 mb-3 text-primary">🎉</div>
                <h3 class="click-to-speak">Your Final Score</h3>
                <div class="display-3 fw-bold text-primary my-3 click-to-speak">${finalScore}/100</div>
                <p class="fs-5 click-to-speak">Time taken: ${timerElement.textContent}</p>
                <button class="btn btn-primary btn-lg mt-3" onclick="location.reload()">
                    <i class="fas fa-redo me-2"></i>Play Again
                </button>
            </div>
        `;
        
        speak(`Game completed. Your final score is ${finalScore} out of 100.`);
        nextButton.classList.add('d-none');
    }

    // Event listeners
    nextButton.addEventListener('click', nextQuestion);

    // Start the game
    initGame();
 
});