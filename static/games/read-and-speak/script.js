// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Game variables
    let currentParagraph = 0;
    let score = 0;
    let startTime;
    let timerInterval;
    let recognition;
    let paragraphs = [];
    let accuracyScores = [];
    
    // DOM elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const nextBtn = document.getElementById('next-btn');
    const startRecordingBtn = document.getElementById('start-recording');
    const stopRecordingBtn = document.getElementById('stop-recording');
    const targetParagraph = document.getElementById('target-paragraph');
    const userSpeech = document.getElementById('user-speech');
    const resultFeedback = document.getElementById('result-feedback');
    const accuracyScore = document.getElementById('accuracy-score');
    const accuracyBar = document.getElementById('accuracy-bar');
    const correctWords = document.getElementById('correct-words');
    const incorrectWords = document.getElementById('incorrect-words');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const timerElement = document.getElementById('timer');
    const finalScore = document.getElementById('final-score');
    const finalTime = document.getElementById('final-time');
    const averageAccuracy = document.getElementById('average-accuracy');

    // Simple English paragraphs for children
    const paragraphData = [
        "I have a red ball. It is big and bouncy. I play with it every day. My dog likes to chase it too.",
        "The sun is bright today. The sky is blue with white clouds. Birds are flying high above the trees.",
        "My cat is black and white. She sleeps on my bed. She likes to drink milk and chase mice.",
        "We go to school by bus. Our teacher is nice. We learn numbers and letters every morning.",
        "I like to eat apples and bananas. Fruits are good for health. My mom says I should eat them every day.",
        "My room has a bed and a desk. I keep my toys in a box. The walls are blue like the ocean.",
        "In summer, we go to the beach. I build sand castles and swim in the sea. The water is warm and nice.",
        "My brother has a bicycle. It is green with black wheels. He rides it in the park every evening.",
        "Grandma bakes cookies on Sunday. They smell delicious. I help her mix the flour and sugar.",
        "The zoo has many animals. I see lions, elephants and monkeys. The monkeys swing on trees and make funny faces.",
        "I wake up early in the morning. I brush my teeth and wash my face. Then I eat breakfast with my family.",
        "Dad reads the newspaper every day. He drinks coffee and talks to Mom. I like to listen to their stories.",
        "There is a big tree in our yard. Birds live in the branches. Sometimes, squirrels jump from tree to tree.",
        "I wear my raincoat when it rains. I jump in puddles with my boots. Rain makes the grass grow green.",
        "We visit the library on Fridays. I borrow picture books and storybooks. Reading makes me happy.",
        "At night, I look at the stars. The moon shines bright in the sky. I wonder what is out there in space.",
        "My best friend lives next door. We play hide and seek in the garden. We laugh and have so much fun.",
        "I like to draw and color. I use crayons and markers. My favorite color is yellow like the sun.",
        "Sometimes, we go camping in the forest. We sit around a fire and tell stories. The night is quiet and dark.",
        "Mom plants flowers in the garden. She waters them every morning. The flowers bloom in red, yellow, and pink.",
        "The market is full of colors. I see red tomatoes, green lettuce, and yellow bananas. People are buying fresh food.",
        "We play soccer after school. I kick the ball and run fast. My friends cheer when we score a goal.",
        "I hear music from the radio. The song is happy and fun. I dance around the room with my sister.",
        "Our house is small but cozy. There is a big window in the living room. I like to sit there and read.",
        "I help Dad wash the car. We use soap, water, and a sponge. The car shines when we finish.",
        "The bakery smells so good. I see bread, cakes, and donuts. My favorite is the chocolate cupcake.",
        "We visit the farm in spring. There are cows, chickens, and sheep. I feed the animals with corn and hay.",
        "At school, we paint pictures. I draw a rainbow and a tree. My teacher says my work is beautiful.",
        "My baby sister is learning to walk. She holds my hand and takes small steps. We clap when she stands alone.",
        "Sometimes, I feel sad or tired. I talk to Mom and she hugs me. Her smile makes me feel better."
    ];

    // Initialize speech recognition
    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in your browser. Try Chrome or Edge.");
            return false;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            userSpeech.innerHTML = finalTranscript + '<span style="color:#999;">' + interimTranscript + '</span>';
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
        };

        return true;
    }

    // Shuffle array function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Calculate accuracy between two texts
    function calculateAccuracy(original, userText) {
        if (!userText || userText.trim() === '') return 0;
        
        const originalWords = original.toLowerCase().split(/\s+/);
        const userWords = userText.toLowerCase().split(/\s+/);
        
        let correctCount = 0;
        const minLength = Math.min(originalWords.length, userWords.length);
        
        for (let i = 0; i < minLength; i++) {
            if (originalWords[i] === userWords[i]) {
                correctCount++;
            }
        }
        
        // Calculate accuracy percentage (weighted by length)
        const accuracy = (correctCount / originalWords.length) * 100;
        return Math.round(accuracy);
    }

    // Highlight differences between texts
    function highlightDifferences(original, userText) {
        const originalWords = original.split(/\s+/);
        const userWords = userText.split(/\s+/);
        
        let correctHtml = '';
        let incorrectHtml = '';
        
        const minLength = Math.min(originalWords.length, userWords.length);
        
        for (let i = 0; i < minLength; i++) {
            if (originalWords[i].toLowerCase() === userWords[i].toLowerCase()) {
                correctHtml += `<span class="text-success">${originalWords[i]}</span> `;
            } else {
                incorrectHtml += `<span class="text-danger">${userWords[i] || '?'}</span> `;
            }
        }
        
        // Handle extra words
        if (originalWords.length > userWords.length) {
            for (let i = minLength; i < originalWords.length; i++) {
                incorrectHtml += `<span class="text-danger">(${originalWords[i]})</span> `;
            }
        } else if (userWords.length > originalWords.length) {
            for (let i = minLength; i < userWords.length; i++) {
                incorrectHtml += `<span class="text-danger">+${userWords[i]}</span> `;
            }
        }
        
        correctWords.innerHTML = correctHtml || '<span class="text-muted">No correct words</span>';
        incorrectWords.innerHTML = incorrectHtml || '<span class="text-muted">No mistakes</span>';
    }

    // Start game
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    function startGame() {
        // Initialize speech recognition
        if (!initSpeechRecognition()) return;
        
        // Shuffle paragraphs
        paragraphs = shuffleArray([...paragraphData]);
        
        currentParagraph = 0;
        score = 0;
        accuracyScores = [];
        startScreen.classList.add('d-none');
        resultScreen.classList.add('d-none');
        gameScreen.classList.remove('d-none');
        resultFeedback.classList.add('d-none');
        nextBtn.classList.add('d-none');
        userSpeech.textContent = '';

        // Start timer
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
        updateTimer();

        loadParagraph();
    }

    // Update timer
    function updateTimer() {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
        const seconds = (elapsedTime % 60).toString().padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }

    // Load paragraph
    function loadParagraph() {
        if (currentParagraph >= paragraphs.length) {
            endGame();
            return;
        }

        const paragraph = paragraphs[currentParagraph];
        targetParagraph.textContent = paragraph;

        // Update progress
        progressText.textContent = `Paragraph ${currentParagraph + 1} of ${paragraphs.length}`;
        progressBar.style.width = `${((currentParagraph + 1) / paragraphs.length) * 100}%`;

        // Reset UI for new paragraph
        userSpeech.textContent = '';
        resultFeedback.classList.add('d-none');
        nextBtn.classList.add('d-none');
        startRecordingBtn.classList.remove('d-none');
        stopRecordingBtn.classList.add('d-none');
    }

    // Start/stop recording handlers
    startRecordingBtn.addEventListener('click', function() {
        recognition.start();
        startRecordingBtn.classList.add('d-none');
        stopRecordingBtn.classList.remove('d-none');
        userSpeech.textContent = 'Listening...';
    });

    stopRecordingBtn.addEventListener('click', function() {
        recognition.stop();
        startRecordingBtn.classList.remove('d-none');
        stopRecordingBtn.classList.add('d-none');
        
        // Calculate accuracy
        const originalText = targetParagraph.textContent;
        const userText = userSpeech.textContent.replace(/<[^>]*>/g, ''); // Remove HTML tags
        
        const accuracy = calculateAccuracy(originalText, userText);
        accuracyScores.push(accuracy);
        
        // Update score (cumulative accuracy)
        score = Math.round(accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length);
        
        // Show feedback
        accuracyScore.textContent = accuracy;
        accuracyBar.style.width = `${accuracy}%`;
        accuracyBar.className = `progress-bar ${accuracy >= 70 ? 'bg-success' : accuracy >= 40 ? 'bg-warning' : 'bg-danger'}`;
        
        highlightDifferences(originalText, userText);
        resultFeedback.classList.remove('d-none');
        nextBtn.classList.remove('d-none');
        
        // Play feedback sound
        playGameAudio(accuracy >= 70 ? 'audio-true' : 'audio-false');
    });

    // Next paragraph handler
    nextBtn.addEventListener('click', function() {
        currentParagraph++;
        loadParagraph();
    });

    // End game
    function endGame() {
        clearInterval(timerInterval);
        
        // Calculate final score (scaled to 100)
        const finalScoreValue = Math.round(accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length);
        
        finalScore.textContent = finalScoreValue;
        averageAccuracy.textContent = finalScoreValue;
        finalTime.textContent = timerElement.textContent;
        
        gameScreen.classList.add('d-none');
        resultScreen.classList.remove('d-none');
    }
});