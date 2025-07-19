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


async function speak(text) {
    const response = await fetch('/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        return;
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);

    const audio = document.getElementById("game-audio-speech");
    audio.src = audioUrl;
    audio.style.display = 'block';
    audio.play();
}


function setupClickToSpeak() {
    const elements = document.querySelectorAll('.click-to-speak');

    elements.forEach(el => {
        // Pastikan hanya ditambahkan sekali
        if (!el.querySelector('.speaker-icon')) {
            el.style.position = 'relative'; // buat elemen sebagai parent posisi relatif

            const icon = document.createElement('div');
            icon.className = 'speaker-icon';
            icon.title = 'Klik untuk dengar';
            icon.innerHTML = '<i class="fa fa-play-circle"></i>'; // pastikan font-awesome dimuat
            icon.style.position = 'absolute';
            icon.style.top = '5px';
            icon.style.right = '5px';
            icon.style.cursor = 'pointer';
            icon.style.zIndex = '10';
            icon.style.fontSize = '1.2em';
            icon.style.color = '#007bff';


            icon.addEventListener('click', (e) => {
                var textContent = el.textContent.trim();
                var cleanedText = textContent.replace(/[^a-zA-Z0-9.,\s]/g, '');
                e.stopPropagation();
                speak(cleanedText);
            });

            el.appendChild(icon);
        }
    });
}


// Observer untuk mendeteksi elemen baru yang memiliki class .click-to-speak
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // hanya elemen
                if (node.classList.contains('click-to-speak') || node.querySelector('.click-to-speak')) {
                    setupClickToSpeak();
                }
            }
        });
    });
});


// Jalankan observer terhadap perubahan DOM
observer.observe(document.body, { childList: true, subtree: true });


document.addEventListener('DOMContentLoaded', setupClickToSpeak);