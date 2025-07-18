function playGameAudio(audioId) {
    const audio = document.getElementById(audioId);

    if (!audio) {
        console.warn(`Audio with ID "${audioId}" not found.`);
        return;
    }

    // Restart if already playing
    if (!audio.paused) {
        audio.currentTime = 0;
    }

    audio.play().catch((err) => {
        console.error(`Failed to play audio "${audioId}":`, err);
    });
}
