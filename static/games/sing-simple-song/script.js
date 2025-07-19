const songs = [
    {
        title: "Count on Me - Bruno Mars",
        lyrics: [
            "If you ever find yourself stuck in the middle of the sea",
            "I'll sail the world to find you",
            "If you ever find yourself lost in the dark and you can't see",
            "I'll be the light to guide you",
            "You can count on me like one, two, three",
            "I'll be there",
            "And I know when I need it",
            "I can count on you like four, three, two",
            "And you'll be there"
        ],
        level: "easy"
    },
    {
        title: "Happy - Pharrell Williams",
        lyrics: [
            "It might seem crazy what I'm about to say",
            "Sunshine she's here, you can take a break",
            "I'm a hot air balloon that could go to space",
            "With the air, like I don't care baby by the way",
            "Because I'm happy",
            "Clap along if you feel like a room without a roof",
            "Because I'm happy",
            "Clap along if you feel like happiness is the truth"
        ],
        level: "medium"
    },
    {
        title: "Imagine - John Lennon",
        lyrics: [
            "Imagine there's no heaven",
            "It's easy if you try",
            "No hell below us",
            "Above us only sky",
            "Imagine all the people",
            "Living for today"
        ],
        level: "advanced"
    }
];


// Game variables
let currentSongIndex = 0;
let currentLyricIndex = 0;
let score = 0;

// DOM elements
const songTitle = document.getElementById('songTitle');
const lyricsDisplay = document.getElementById('lyricsDisplay');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const prevSongBtn = document.getElementById('prevSongBtn');
const nextSongBtn = document.getElementById('nextSongBtn');
const scoreDisplay = document.getElementById('score');

// Initialize game
function initGame() {
    loadSong();
    
    prevBtn.addEventListener('click', showPreviousLyric);
    nextBtn.addEventListener('click', showNextLyric);
    prevSongBtn.addEventListener('click', showPreviousSong);
    nextSongBtn.addEventListener('click', showNextSong);
}

// Load current song
function loadSong() {
    const song = songs[currentSongIndex];
    songTitle.textContent = song.title;
    currentLyricIndex = 0;
    updateLyricDisplay();
    updateSongNavButtons();
}

// Update lyric display
function updateLyricDisplay() {
    const song = songs[currentSongIndex];
    lyricsDisplay.innerHTML = `
        <p class="display-6 click-to-speak">${song.lyrics[currentLyricIndex]}</p>
    `;
    
    // Update button states
    prevBtn.disabled = currentLyricIndex === 0;
    nextBtn.disabled = currentLyricIndex === song.lyrics.length - 1;
}

// Show previous lyric
function showPreviousLyric() {
    if (currentLyricIndex > 0) {
        currentLyricIndex--;
        updateLyricDisplay();
    }
}

// Show next lyric
function showNextLyric() {
    const song = songs[currentSongIndex];
    
    if (currentLyricIndex < song.lyrics.length - 1) {
        currentLyricIndex++;
        updateLyricDisplay();
        score++;
        updateScore();
    }
}

// Show previous song
function showPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong();
}

// Show next song
function showNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong();
}

// Update song navigation buttons
function updateSongNavButtons() {
    prevSongBtn.disabled = currentSongIndex === 0;
    nextSongBtn.disabled = currentSongIndex === songs.length - 1;
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
    scoreDisplay.classList.add('animate__animated', 'animate__bounce');
    setTimeout(() => {
        scoreDisplay.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
}

// Start game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);