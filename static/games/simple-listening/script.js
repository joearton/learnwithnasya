// Game variables
let currentQuestionIndex = 0;
let score = 0;
let startTime;
let questions = [];
let selectedQuestions = [];

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const playQuestionBtn = document.getElementById('play-question');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const feedbackEl = document.getElementById('feedback');
const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const progressBar = document.getElementById('progress-bar');
const finalScoreEl = document.getElementById('final-score');
const timeTakenEl = document.getElementById('time-taken');
const restartBtn = document.getElementById('restart-btn');

// Questions data
const questionBank = [
    {
        text: "Tom is a little boy who loves animals. He has a pet dog named Max. Max is brown and white with floppy ears. Every morning, Tom takes Max for a walk in the park. Max likes to chase squirrels but he never catches them. Tom gives Max a bath every Saturday. Max doesn't like baths but he loves the treats he gets afterwards.",
        question: "What does Max like to do in the park?",
        options: ["Chase squirrels","Swim in the lake","Play with other dogs","Sleep under a tree"],
        answer: 0
    },
    {
        text: "Lucy lives in a big house with her family. Her favorite room is the kitchen because she loves to bake cookies with her mom. They make chocolate chip cookies every Sunday. Lucy's little brother always tries to eat the cookie dough before it goes in the oven. Lucy's dad says the cookies taste best with a glass of cold milk.",
        question: "When does Lucy bake cookies with her mom?",
        options: ["Every Saturday","Every Sunday","Every Friday","Only on holidays"],
        answer: 1
    },
    {
        text: "The school is having a science fair next month. Emma wants to build a volcano that really erupts. Her friend Jake is going to make a model of the solar system. Emma's volcano will use baking soda and vinegar to make foam that looks like lava. She's excited to show her project to the whole school.",
        question: "What will Emma use to make her volcano erupt?",
        options: ["Water and oil","Baking soda and vinegar","Salt and pepper","Lemon juice and sugar"],
        answer: 1
    },
    {
        text: "On rainy days, the children stay inside during recess. They play board games in the classroom. Sarah's favorite game is checkers because she always beats her friends. Michael prefers card games. The teacher sometimes lets them watch educational videos if they finish their work early.",
        question: "What does Sarah like to play on rainy days?",
        options: ["Card games","Checkers","Hide and seek","Watching videos"],
        answer: 1
    },
    {
        text: "The zoo has a new baby panda. Hundreds of people come to see the little panda every day. The panda spends most of its time sleeping or drinking milk from its mother. Zookeepers say the baby panda will start eating bamboo when it's six months old. The panda exhibit is the most popular place in the whole zoo.",
        question: "What does the baby panda do most of the time?",
        options: ["Eats bamboo", "Plays with other pandas", "Sleeps or drinks milk", "Runs around the exhibit"],
        answer: 2
    },
    {
        text: "Anna loves reading books. She goes to the library every weekend. Her favorite books are about space and planets. She wants to become an astronaut someday. Her room is full of posters of stars and rockets.",
        question: "What kind of books does Anna like?",
        options: ["Fairy tales", "Space and planets", "Animals", "Mystery"],
        answer: 1
    },
    {
        text: "Ben has a garden behind his house. He grows carrots, tomatoes, and lettuce. Every morning, he waters the plants. On weekends, he pulls out weeds and checks for bugs.",
        question: "What does Ben do in the morning?",
        options: ["Harvest vegetables", "Water the plants", "Plant new seeds", "Pull weeds"],
        answer: 1
    },
    {
        text: "Mia's class is going on a field trip to the museum. She is excited to see the dinosaur skeletons and ancient artifacts. Her teacher asked everyone to bring a lunch and wear comfortable shoes.",
        question: "What is Mia excited to see at the museum?",
        options: ["Paintings", "Fossils", "Dinosaur skeletons", "Books"],
        answer: 2
    },
    {
        text: "Every evening, Jack walks his grandmother’s dog. The dog’s name is Bella, and she loves to chase butterflies. Jack makes sure Bella doesn’t run too far away.",
        question: "What does Bella like to chase?",
        options: ["Cats", "Balls", "Butterflies", "Birds"],
        answer: 2
    },
    {
        text: "Sophia helps her dad wash the car on Saturdays. They use soap, water, and a big sponge. After cleaning, her dad buys her ice cream.",
        question: "What does Sophia get after helping her dad?",
        options: ["A toy", "A book", "A new dress", "Ice cream"],
        answer: 3
    },
    {
        text: "Liam likes to play the piano. He practices every day after school. His favorite song is 'Twinkle Twinkle Little Star'. He plays in his school’s music show.",
        question: "What instrument does Liam play?",
        options: ["Guitar", "Violin", "Piano", "Drums"],
        answer: 2
    },
    {
        text: "Emily's mom makes the best pancakes. On Sunday mornings, they eat pancakes with honey and strawberries. Emily always helps by mixing the batter.",
        question: "What does Emily do to help her mom?",
        options: ["Cook the pancakes", "Mix the batter", "Buy strawberries", "Wash the dishes"],
        answer: 1
    },
    {
        text: "Noah and his friends are building a treehouse. They are using wood, nails, and paint. They plan to put pillows and books inside it.",
        question: "What are Noah and his friends building?",
        options: ["A tent", "A treehouse", "A boat", "A swing"],
        answer: 1
    },
    {
        text: "Olivia has a pet rabbit named Snowy. Snowy has soft white fur and long ears. Olivia feeds her carrots and lettuce every day.",
        question: "What does Olivia feed Snowy?",
        options: ["Meat", "Fish", "Carrots and lettuce", "Bread"],
        answer: 2
    },
    {
        text: "James loves flying kites. On windy days, he goes to the park with his dad. His favorite kite is red and shaped like a dragon.",
        question: "What shape is James’s favorite kite?",
        options: ["A bird", "A fish", "A dragon", "A square"],
        answer: 2
    },
    {
        text: "Chloe planted a sunflower seed in a pot. She watered it every day and placed it near sunlight. After a few weeks, the plant started to grow.",
        question: "What did Chloe plant?",
        options: ["A tree", "A rose", "A sunflower", "A tomato"],
        answer: 2
    },
    {
        text: "Ethan likes dinosaurs. He watches dinosaur cartoons and has a collection of dinosaur toys. He even knows all their names.",
        question: "What does Ethan collect?",
        options: ["Stamps", "Cars", "Dinosaur toys", "Coins"],
        answer: 2
    },
    {
        text: "Zoe rides her bike to school. She wears a helmet and stays on the bike path. She enjoys feeling the wind on her face.",
        question: "How does Zoe go to school?",
        options: ["By car", "By bus", "By bike", "By walking"],
        answer: 2
    },
    {
        text: "Daniel has a goldfish named Bubbles. Bubbles swims around in a round glass bowl. Daniel feeds him fish food twice a day.",
        question: "What kind of pet does Daniel have?",
        options: ["A bird", "A cat", "A rabbit", "A goldfish"],
        answer: 3
    },
    {
        text: "Lily loves to draw. She uses crayons and markers to make colorful pictures. She hangs them on the wall in her room.",
        question: "What does Lily do with her drawings?",
        options: ["Gives them away", "Hangs them on the wall", "Throws them out", "Sells them"],
        answer: 1
    },
    {
        text: "Henry went to the beach with his family. He built a big sandcastle and collected seashells. They had a picnic near the water.",
        question: "What did Henry build at the beach?",
        options: ["A boat", "A kite", "A sandcastle", "A house"],
        answer: 2
    },
    {
        text: "Isabella's favorite fruit is watermelon. She eats it during summer because it's sweet and juicy. Her mom cuts it into triangle pieces.",
        question: "What is Isabella’s favorite fruit?",
        options: ["Apple", "Banana", "Watermelon", "Pineapple"],
        answer: 2
    },
    {
        text: "Logan watches birds from his window. He sees bluebirds, sparrows, and sometimes even a hawk. He writes down what he sees in a notebook.",
        question: "What does Logan do when he sees birds?",
        options: ["Takes pictures", "Draws them", "Writes in a notebook", "Feeds them"],
        answer: 2
    },
    {
        text: "Ella and her dad went fishing at the lake. They brought sandwiches and juice. Ella caught a small fish and let it go back in the water.",
        question: "What did Ella do with the fish she caught?",
        options: ["Cooked it", "Kept it", "Gave it away", "Let it go"],
        answer: 3
    },
    {
        text: "Aiden loves trains. He has a train set at home and watches trains pass by near the station. His favorite is the blue engine.",
        question: "What color is Aiden’s favorite train?",
        options: ["Red", "Green", "Blue", "Yellow"],
        answer: 2
    },
    {
        text: "Grace goes shopping with her mother. She helps pick apples and carries the bag. Sometimes, she gets to choose a snack too.",
        question: "What does Grace help her mother do?",
        options: ["Cook", "Clean", "Pick apples", "Paint"],
        answer: 2
    },
    {
        text: "Owen loves snow. He builds snowmen and throws snowballs with his sister. They drink hot chocolate afterward to stay warm.",
        question: "What does Owen do after playing in the snow?",
        options: ["Takes a nap", "Eats cookies", "Watches TV", "Drinks hot chocolate"],
        answer: 3
    },
    {
        text: "Harper saw a rainbow after the rain. She counted seven colors and took a picture. She wants to paint it later.",
        question: "What did Harper do after seeing the rainbow?",
        options: ["Ran home", "Took a picture", "Called her friend", "Jumped in puddles"],
        answer: 1
    },
    {
        text: "Carter visits his grandma every weekend. She tells him stories and makes his favorite soup. Carter always brings her flowers.",
        question: "What does Carter bring his grandma?",
        options: ["Books", "Candy", "Flowers", "Toys"],
        answer: 2
    },
    {
        text: "Abigail loves playing with building blocks. She makes towers and bridges. Sometimes, her brother knocks them down.",
        question: "What does Abigail build with?",
        options: ["Legos", "Wooden toys", "Cards", "Building blocks"],
        answer: 3
    }
];


function startGame() {
    stopSpeech(); // Stop speech saat mulai game
    startTime = new Date();
    startScreen.classList.add('d-none');
    gameScreen.classList.remove('d-none');
    totalQuestionsEl.textContent = selectedQuestions.length;
    loadQuestion();
}

function initGame() {
    stopSpeech(); // Stop speech saat reset game
    selectedQuestions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 30);
    currentQuestionIndex = 0;
    score = 0;
    startScreen.classList.remove('d-none');
    gameScreen.classList.add('d-none');
    resultScreen.classList.add('d-none');
}


// Load question
function loadQuestion() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    
    // Update progress - PERBAIKAN DI SINI
    const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    feedbackEl.textContent = '';
    nextBtn.classList.add('d-none');
    
    // Set up question play button
    playQuestionBtn.onclick = () => {
        talk(currentQuestion.text);
    };
    
    // Create options buttons
    currentQuestion.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'btn btn-outline-primary option-btn col-md-6 py-3 click-to-speak';
        optionBtn.textContent = option;
        optionBtn.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(optionBtn);
    });
    
    // Speak the question automatically after a short delay
    setTimeout(() => {
        talk(currentQuestion.text);
    }, 500);
}


// Check answer
function checkAnswer(selectedIndex) {
    stopSpeech(); // Stop speech saat memilih jawaban
    
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach(btn => {
        btn.disabled = true;
    });
    
    if (selectedIndex === currentQuestion.answer) {
        optionButtons[selectedIndex].classList.remove('btn-outline-primary');
        optionButtons[selectedIndex].classList.add('btn-success');
        feedbackEl.textContent = 'Correct! Well done!';
        feedbackEl.className = 'h5 text-success';
        score += 20;
        playGameAudio('audio-true');
    } else {
        optionButtons[selectedIndex].classList.remove('btn-outline-primary');
        optionButtons[selectedIndex].classList.add('btn-danger');
        optionButtons[currentQuestion.answer].classList.remove('btn-outline-primary');
        optionButtons[currentQuestion.answer].classList.add('btn-success');
        feedbackEl.textContent = `Good try! The correct answer is: ${currentQuestion.options[currentQuestion.answer]}`;
        feedbackEl.className = 'h5 text-danger';
        playGameAudio('audio-false');
    }
    
    nextBtn.classList.remove('d-none');
}


// Next question
function nextQuestion() {
    stopSpeech(); // Stop speech saat next question
    currentQuestionIndex++;
    if (currentQuestionIndex < selectedQuestions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}



// End game
function endGame() {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    
    // Format durasi menjadi menit:detik
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const formattedTime = `${minutes}m ${seconds}s`;
    
    gameScreen.classList.add('d-none');
    resultScreen.classList.remove('d-none');
    finalScoreEl.textContent = score;
    timeTakenEl.textContent = formattedTime;
}

// Event listeners
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', initGame);

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initGame);