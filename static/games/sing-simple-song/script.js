// Song database
const songs = [
    {
        title: "Twinkle Twinkle Little Star",
        lyrics: [
            "Twinkle, twinkle, little star,",
            "How I wonder what you are!",
            "Up above the world so high,",
            "Like a diamond in the sky.",
            "Twinkle, twinkle, little star,",
            "How I wonder what you are!"
        ],
        audio: "/static/games/sing-simple-song/songs/twinkle.mp3"
    },
    {
        title: "The Alphabet Song",
        lyrics: [
            "A, B, C, D, E, F, G,",
            "H, I, J, K, L, M, N, O, P,",
            "Q, R, S, T, U, V,",
            "W, X, Y, and Z.",
            "Now I know my ABCs,",
            "Next time won't you sing with me?"
        ],
        audio: "/static/games/sing-simple-song/songs/alphabet.mp3"
    },
    {
        title: "Old MacDonald Had a Farm",
        lyrics: [
            "Old MacDonald had a farm, E-I-E-I-O",
            "And on that farm he had a cow, E-I-E-I-O",
            "With a moo moo here and a moo moo there",
            "Here a moo, there a moo, everywhere a moo moo",
            "Old MacDonald had a farm, E-I-E-I-O"
        ],
        audio: "/static/games/sing-simple-song/songs/macdonald.mp3"
    },
    {
        title: "If You're Happy and You Know It",
        lyrics: [
            "If you're happy and you know it, clap your hands",
            "If you're happy and you know it, clap your hands",
            "If you're happy and you know it, then your face will surely show it",
            "If you're happy and you know it, clap your hands"
        ],
        audio: "/static/games/sing-simple-song/songs/happy.mp3"
    },
    {
        title: "Head, Shoulders, Knees and Toes",
        lyrics: [
            "Head, shoulders, knees and toes, knees and toes",
            "Head, shoulders, knees and toes, knees and toes",
            "And eyes and ears and mouth and nose",
            "Head, shoulders, knees and toes, knees and toes"
        ],
        audio: "/static/games/sing-simple-song/songs/headshoulders.mp3"
    }
];

// Game variables
let currentSong = null;
let currentLine = 0;
let score = 0;
let startTime = null;
let songAudio = null;
let applauseAudio = null;

// DOM elements
const startScreen = document.getElementById('start-screen');
const songSelection = document.getElementById('song-selection');
const singingScreen = document.getElementById('singing-screen');
const startBtn = document.getElementById('start-btn');
const backToStartBtn = document.getElementById('back-to-start');
const backToSongsBtn = document.getElementById('back-to-songs');
const songChoices = document.getElementById('song-choices');
const songTitle = document.getElementById('song-title');
const lyricsContainer = document.getElementById('lyrics-container');
const playBtn = document.getElementById('play-btn');
const nextSongBtn = document.getElementById('next-song-btn');
const progressBar = document.getElementById('progress-bar');
const scoreDisplay = document.getElementById('score');

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    songAudio = document.getElementById('song-audio');
    applauseAudio = document.getElementById('applause-audio');
    
    // Set up event listeners
    startBtn.addEventListener('click', showSongSelection);
    backToStartBtn.addEventListener('click', showStartScreen);
    backToSongsBtn.addEventListener('click', showSongSelection);
    playBtn.addEventListener('click', playSong);
    nextSongBtn.addEventListener('click', showSongSelection);
    
    // Populate song choices
    populateSongChoices();
});

function showStartScreen() {
    startScreen.classList.remove('d-none');
    songSelection.classList.add('d-none');
    singingScreen.classList.add('d-none');
    if (songAudio) {
        songAudio.pause();
        songAudio.currentTime = 0;
    }
}

function showSongSelection() {
    startScreen.classList.add('d-none');
    songSelection.classList.remove('d-none');
    singingScreen.classList.add('d-none');
    if (songAudio) {
        songAudio.pause();
        songAudio.currentTime = 0;
    }
    // Shuffle songs for variety
    shuffleArray(songs);
}

function showSingingScreen(song) {
    startScreen.classList.add('d-none');
    songSelection.classList.add('d-none');
    singingScreen.classList.remove('d-none');
    
    currentSong = song;
    currentLine = 0;
    score = 0;
    startTime = new Date();
    
    // Update UI
    songTitle.textContent = song.title;
    scoreDisplay.textContent = score;
    progressBar.style.width = '0%';
    
    // Display lyrics
    lyricsContainer.innerHTML = '';
    song.lyrics.forEach((line, index) => {
        const lineElement = document.createElement('div');
        lineElement.classList.add('lyrics-line');
        if (index === 0) lineElement.classList.add('highlight');
        lineElement.textContent = line;
        lineElement.classList.add('click-to-speak');
        lyricsContainer.appendChild(lineElement);
    });
    
    // Set up audio
    songAudio.src = song.audio;
    songAudio.load();
}

function populateSongChoices() {
    songChoices.innerHTML = '';
    
    songs.forEach((song, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        
        const card = document.createElement('div');
        card.className = 'card song-card bg-light p-3';
        card.innerHTML = `
            <div class="card-body text-center">
                <i class="fas fa-music fa-3x text-primary mb-3"></i>
                <h5 class="card-title click-to-speak">${song.title}</h5>
            </div>
        `;
        
        card.addEventListener('click', () => {
            showSingingScreen(song);
            speak(song.title); // Read the song title for accessibility
        });
        
        col.appendChild(card);
        songChoices.appendChild(col);
    });
}

function playSong() {
    if (songAudio.paused) {
        playBtn.innerHTML = '<i class="fas fa-pause me-2"></i>Pause';
        songAudio.play();
        
        // Highlight lyrics as they play
        songAudio.addEventListener('timeupdate', highlightLyrics);
        songAudio.addEventListener('ended', songFinished);
    } else {
        playBtn.innerHTML = '<i class="fas fa-play me-2"></i>Play';
        songAudio.pause();
    }
}

function highlightLyrics() {
    const duration = songAudio.duration;
    const currentTime = songAudio.currentTime;
    const progress = (currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Calculate which line should be highlighted based on current time
    const totalLines = currentSong.lyrics.length;
    const timePerLine = duration / totalLines;
    const newLine = Math.floor(currentTime / timePerLine);
    
    if (newLine !== currentLine && newLine < totalLines) {
        // Remove highlight from previous line
        if (currentLine < totalLines) {
            const prevLineElement = lyricsContainer.children[currentLine];
            prevLineElement.classList.remove('highlight');
        }
        
        // Add highlight to new line
        currentLine = newLine;
        const currentLineElement = lyricsContainer.children[currentLine];
        currentLineElement.classList.add('highlight');
        
        // Scroll to the highlighted line
        currentLineElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Update score based on participation
        if (score < 100) {
            score += Math.floor(100 / totalLines);
            if (score > 100) score = 100;
            scoreDisplay.textContent = score;
        }
    }
}

function songFinished() {
    playBtn.innerHTML = '<i class="fas fa-play me-2"></i>Play Again';
    progressBar.style.width = '100%';
    
    // Play applause if they did well
    if (score > 70) {
        applauseAudio.play();
        playGameAudio('audio-true');
    } else {
        playGameAudio('audio-false');
    }
    
    // Calculate time spent
    const endTime = new Date();
    const timeSpent = (endTime - startTime) / 1000; // in seconds
    console.log(`Game completed in ${timeSpent} seconds with score ${score}`);
}

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}