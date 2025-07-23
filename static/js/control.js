let speechAudio = document.getElementById("audio-speech");
let currentSpeech = null;


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



function stopSpeech() {
    if (speechAudio) {
        speechAudio.pause();
        speechAudio.currentTime = 0;
    }
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}



async function speak(text) {
    stopSpeech(); // Stop speech sebelumnya
    
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

    speechAudio.src = audioUrl;
    speechAudio.style.display = 'block';
    currentSpeech = speechAudio.play();
}


// Text-to-Speech
function talk(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    } else {
        console.log("Text-to-speech not supported");
    }
}


function setupClickToSpeak() {
    const elements = document.querySelectorAll('.click-to-speak');

    elements.forEach(el => {
        // Pastikan hanya ditambahkan sekali
        if (!el.querySelector('.speaker-icon')) {
            el.style.position = 'relative'; 

            const icon = document.createElement('div');
            icon.className = 'speaker-icon';
            icon.title = 'Click to listen';
            icon.innerHTML = '<i class="fa fa-play-circle"></i>';
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