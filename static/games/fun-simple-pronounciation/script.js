// Enhanced Game Data with 30 sentences across 3 difficulty levels
const sentences = [
    // Easy (10)
    { 
        sentence: "I eat an apple every morning", 
        keywords: ["apple", "eat", "morning"],
        translation: "Saya makan apel setiap pagi",
        difficulty: "easy"
    },
    { 
        sentence: "The cat is sleeping on the sofa", 
        keywords: ["cat", "sleeping", "sofa"],
        translation: "Kucing sedang tidur di sofa",
        difficulty: "easy"
    },
    { 
        sentence: "We need to walk the dog in the park", 
        keywords: ["walk", "dog", "park"],
        translation: "Kita perlu ajak anjing jalan di taman",
        difficulty: "easy" 
    },
    { 
        sentence: "She waters the flowers every evening", 
        keywords: ["waters", "flowers", "evening"],
        translation: "Dia menyiram bunga setiap sore",
        difficulty: "easy"
    },
    { 
        sentence: "My favorite color is blue", 
        keywords: ["favorite", "color", "blue"],
        translation: "Warna favorit saya adalah biru",
        difficulty: "easy"
    },
    { 
        sentence: "The sun is shining brightly today", 
        keywords: ["sun", "shining", "today"],
        translation: "Matahari bersinar terang hari ini",
        difficulty: "easy"
    },
    { 
        sentence: "I have two brothers and one sister", 
        keywords: ["two", "brothers", "sister"],
        translation: "Saya punya dua saudara laki dan satu perempuan",
        difficulty: "easy"
    },
    { 
        sentence: "We go to school by bus", 
        keywords: ["school", "go", "bus"],
        translation: "Kami pergi ke sekolah naik bus",
        difficulty: "easy"
    },
    { 
        sentence: "The baby is crying loudly", 
        keywords: ["baby", "crying", "loudly"],
        translation: "Bayinya menangis keras",
        difficulty: "easy"
    },
    { 
        sentence: "I like to play with my toys", 
        keywords: ["like", "play", "toys"],
        translation: "Saya suka bermain dengan mainan saya",
        difficulty: "easy"
    },

    // Medium (10)
    { 
        sentence: "Elephants are the largest land animals", 
        keywords: ["elephants", "largest", "land"],
        translation: "Gajah adalah hewan darat terbesar",
        difficulty: "medium"
    },
    { 
        sentence: "My mother is cooking in the kitchen", 
        keywords: ["mother", "cooking", "kitchen"],
        translation: "Ibuku sedang memasak di dapur",
        difficulty: "medium"
    },
    { 
        sentence: "The library has many interesting books", 
        keywords: ["library", "many", "books"],
        translation: "Perpustakaan memiliki banyak buku menarik",
        difficulty: "medium"
    },
    { 
        sentence: "We should brush our teeth twice a day", 
        keywords: ["brush", "teeth", "twice"],
        translation: "Kita harus menyikat gigi dua kali sehari",
        difficulty: "medium"
    },
    { 
        sentence: "The teacher is writing on the whiteboard", 
        keywords: ["teacher", "writing", "whiteboard"],
        translation: "Guru sedang menulis di papan tulis",
        difficulty: "medium"
    },
    { 
        sentence: "My birthday is in December", 
        keywords: ["birthday", "December"],
        translation: "Ulang tahunku di bulan Desember",
        difficulty: "medium"
    },
    { 
        sentence: "The supermarket sells fresh vegetables", 
        keywords: ["supermarket", "sells", "vegetables"],
        translation: "Supermarket menjual sayuran segar",
        difficulty: "medium"
    },
    { 
        sentence: "We visited the zoo last weekend", 
        keywords: ["visited", "zoo", "weekend"],
        translation: "Kami mengunjungi kebun binatang minggu lalu",
        difficulty: "medium"
    },
    { 
        sentence: "The hospital is near the post office", 
        keywords: ["hospital", "near", "post office"],
        translation: "Rumah sakit dekat dengan kantor pos",
        difficulty: "medium"
    },
    { 
        sentence: "My father works at a bank", 
        keywords: ["father", "works", "bank"],
        translation: "Ayahku bekerja di bank",
        difficulty: "medium"
    },

    // Hard (10)
    { 
        sentence: "The astronaut floated weightlessly in space", 
        keywords: ["astronaut", "floated", "space"],
        translation: "Astronot melayang tanpa bobot di angkasa",
        difficulty: "hard"
    },
    { 
        sentence: "Scientists conduct experiments in laboratories", 
        keywords: ["scientists", "experiments", "laboratories"],
        translation: "Ilmuwan melakukan percobaan di laboratorium",
        difficulty: "hard"
    },
    { 
        sentence: "The magnificent waterfall attracts many tourists", 
        keywords: ["magnificent", "waterfall", "tourists"],
        translation: "Air terjun yang megah menarik banyak turis",
        difficulty: "hard"
    },
    { 
        sentence: "Electricity powers most modern appliances", 
        keywords: ["electricity", "powers", "appliances"],
        translation: "Listrik menggerakkan sebagian besar peralatan modern",
        difficulty: "hard"
    },
    { 
        sentence: "Recycling helps protect our environment", 
        keywords: ["recycling", "protect", "environment"],
        translation: "Daur ulang membantu melindungi lingkungan kita",
        difficulty: "hard"
    },
    { 
        sentence: "The orchestra performed a beautiful symphony", 
        keywords: ["orchestra", "performed", "symphony"],
        translation: "Orkestra membawakan simfoni yang indah",
        difficulty: "hard"
    },
    { 
        sentence: "Nutritionists recommend balanced diets", 
        keywords: ["nutritionists", "recommend", "diets"],
        translation: "Ahli gizi merekomendasikan diet seimbang",
        difficulty: "hard"
    },
    { 
        sentence: "The archaeologist discovered ancient artifacts", 
        keywords: ["archaeologist", "discovered", "artifacts"],
        translation: "Arkeolog menemukan artefak kuno",
        difficulty: "hard"
    },
    { 
        sentence: "Volcanoes can erupt without warning", 
        keywords: ["volcanoes", "erupt", "warning"],
        translation: "Gunung berapi bisa meletus tanpa peringatan",
        difficulty: "hard"
    },
    { 
        sentence: "The journalist interviewed the famous author", 
        keywords: ["journalist", "interviewed", "author"],
        translation: "Wartawan mewawancarai penulis terkenal",
        difficulty: "hard"
    }
];

/// Game State
let currentSentenceIndex = 0;
let score = 0;
let timeLeft = 90;
let timer;
let recognition;
let selectedDifficulty = 'all';
let gameStarted = false;
let correctAnswers = 0;
let wrongAnswers = 0;
let filteredSentences = [];

// DOM Elements
let micButton, feedbackEl, userSpeechEl, userTextEl, scoreEl, timerEl, progressEl;
let currentSentenceEl;
let difficultySelect, startScreen, gameScreen, resultScreen;

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    initElements();
    setupEventListeners();
});


function initElements() {
    micButton = document.getElementById('micButton');
    feedbackEl = document.getElementById('feedback');
    userSpeechEl = document.getElementById('userSpeech');
    userTextEl = document.querySelector('.user-text');
    scoreEl = document.getElementById('score');
    timerEl = document.getElementById('timer');
    progressEl = document.getElementById('progress');
    currentSentenceEl = document.getElementById('currentSentence');
    difficultySelect = document.getElementById('difficultySelect');
    startScreen = document.getElementById('startScreen');
    gameScreen = document.getElementById('gameScreen');
    resultScreen = document.getElementById('resultScreen');
}

function setupEventListeners() {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedDifficulty = this.dataset.difficulty;
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    startScreen.classList.add('d-none');
    gameScreen.classList.remove('d-none');
    
    // Filter sentences by difficulty
    filteredSentences = sentences; // Use the global sentences array
    if (selectedDifficulty !== 'all') {
        filteredSentences = sentences.filter(s => s.difficulty === selectedDifficulty);
    }
    
    // Shuffle sentences
    filteredSentences = [...filteredSentences].sort(() => Math.random() - 0.5);
    
    // Initialize game state
    currentSentenceIndex = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    timeLeft = filteredSentences.length * 15;
    
    updateScore();
    updateProgress(filteredSentences.length);
    loadSentence();
    startTimer();
    setupSpeechRecognition();
}

function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    micButton.addEventListener('click', toggleRecognition);

    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript.trim();
        const alternatives = Array.from(event.results[0])
            .map(alt => alt.transcript.trim())
            .filter((alt, index, self) => self.indexOf(alt) === index);
        
        console.log("You said:", spokenText);
        console.log("Alternatives:", alternatives);
        checkAnswer(spokenText, alternatives);
    };

    recognition.onerror = function(event) {
        console.error("Recognition error:", event.error);
        feedbackEl.textContent = "Error: " + event.error;
        resetMicButton();
    };

    recognition.onend = function() {
        if (micButton.classList.contains('btn-warning')) {
            recognition.start();
        }
    };
}

function toggleRecognition() {
    if (micButton.classList.contains('btn-danger')) {
        try {
            recognition.start();
            micButton.classList.replace('btn-danger', 'btn-warning');
            micButton.innerHTML = '<i class="fas fa-microphone-slash fa-2x"></i>';
            feedbackEl.textContent = "Listening... Speak now!";
            userSpeechEl.classList.add('d-none');
        } catch (e) {
            console.error("Recognition error:", e);
            feedbackEl.textContent = "Error starting microphone";
        }
    } else {
        recognition.stop();
        resetMicButton();
    }
}

function resetMicButton() {
    micButton.classList.replace('btn-warning', 'btn-danger');
    micButton.innerHTML = '<i class="fas fa-microphone fa-2x"></i>';
}

function checkAnswer(spokenText, alternatives) {
    const currentSentence = filteredSentences[currentSentenceIndex];
    const lowerSpoken = spokenText.toLowerCase();
    const lowerSentence = currentSentence.sentence.toLowerCase();
    
    userSpeechEl.classList.remove('d-none');
    userTextEl.textContent = spokenText;
    
    let isCorrect = false;
    
    if (lowerSpoken === lowerSentence) {
        isCorrect = true;
    } 
    else if (alternatives.some(alt => alt.toLowerCase() === lowerSentence)) {
        isCorrect = true;
    }
    else {
        const keywordMatch = currentSentence.keywords.filter(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            return lowerSpoken.includes(lowerKeyword) || 
                   alternatives.some(alt => alt.toLowerCase().includes(lowerKeyword));
        }).length;
        
        const minKeywords = Math.min(2, currentSentence.keywords.length);
        isCorrect = keywordMatch >= Math.max(minKeywords, Math.ceil(currentSentence.keywords.length * 0.7));
    }
    
    if (isCorrect) {
        feedbackEl.innerHTML = `<span class="text-success">✅ Perfect! <i class="fas fa-check-circle"></i></span>`;
        playGameAudio('audio-true');
        score += calculatePoints(currentSentence.difficulty);
        correctAnswers++;
        updateScore();
        setTimeout(() => nextSentence(), 1500);
    } else {
        feedbackEl.innerHTML = `
            <span class="text-danger">❌ Almost! Try again: 
                <button class="btn btn-sm btn-outline-primary ms-2 click-to-speak" onclick="speakCurrentSentence()">
                    <i class="fas fa-volume-up me-1"></i>Hear again
                </button>
            </span>
        `;
        playGameAudio('audio-false');
        wrongAnswers++;
    }
    
    resetMicButton();
}

function calculatePoints(difficulty) {
    switch(difficulty) {
        case 'easy': return 10;
        case 'medium': return 20;
        case 'hard': return 30;
        default: return 15;
    }
}

function speakCurrentSentence() {
    const currentSentence = filteredSentences[currentSentenceIndex];
    speak(currentSentence.sentence);
}

function nextSentence() {
    currentSentenceIndex++;
    if (currentSentenceIndex >= filteredSentences.length) {
        endGame();
        return;
    }
    
    updateProgress(filteredSentences.length);
    loadSentence();
    userSpeechEl.classList.add('d-none');
    feedbackEl.textContent = '';
}

function loadSentence() {
    const sentenceObj = filteredSentences[currentSentenceIndex];
    currentSentenceEl.innerHTML = `
        <div class="sentence-text h4 fw-bold mb-2 click-to-speak">${sentenceObj.sentence}</div>
        <div class="sentence-translation text-white-50">${sentenceObj.translation}</div>
        <div class="difficulty-badge badge ${getDifficultyBadgeClass(sentenceObj.difficulty)} mt-2">
            ${sentenceObj.difficulty.toUpperCase()}
        </div>
    `;
    
    speak(sentenceObj.sentence);
}

function getDifficultyBadgeClass(difficulty) {
    switch(difficulty) {
        case 'easy': return 'bg-success';
        case 'medium': return 'bg-warning text-dark';
        case 'hard': return 'bg-danger';
        default: return 'bg-primary';
    }
}

function updateScore() {
    scoreEl.textContent = score;
}

function updateProgress(total) {
    progressEl.textContent = `${currentSentenceIndex + 1}/${total}`;
    const progressPercent = ((currentSentenceIndex + 1) / total) * 100;
    document.querySelector('.progress-bar').style.width = `${progressPercent}%`;
}

function startTimer() {
    timerEl.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    gameScreen.classList.add('d-none');
    resultScreen.classList.remove('d-none');
    
    const maxPossibleScore = sentences.length * 30;
    const finalScore = Math.min(Math.round((score / maxPossibleScore) * 100), 100);
    
    document.getElementById('finalScore').textContent = finalScore;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    document.getElementById('timeUsed').textContent = Math.floor((sentences.length * 15 - timeLeft) / 60) + "m " + ((sentences.length * 15 - timeLeft) % 60) + "s";
    
    let performanceMsg = "";
    if (finalScore >= 80) {
        performanceMsg = "Excellent job! You're a language superstar! 🌟";
    } else if (finalScore >= 60) {
        performanceMsg = "Good work! Keep practicing to improve! 👍";
    } else {
        performanceMsg = "Nice try! Practice makes perfect! 💪";
    }
    document.getElementById('performanceMsg').textContent = performanceMsg;
    
    speak(`Game completed! Your score is ${finalScore}. ${performanceMsg}`);
}

function restartGame() {
    gameStarted = false;
    resultScreen.classList.add('d-none');
    startScreen.classList.remove('d-none');
    if (recognition) recognition.stop();
}

// Helper function to speak text
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }
}

// Helper function to play audio
function playGameAudio(id) {
    const audio = document.getElementById(id);
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}