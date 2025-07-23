document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('.toolbox-btn[title]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            placement: 'left'
        });
    });
    
    // Audio Mute Toggle
    const audioBtn = document.getElementById('toolbox-audio');
    if (audioBtn) {
        // Check initial mute state from localStorage
        const isMuted = localStorage.getItem('gameAudioMuted') === 'true';
        if (isMuted) {
            audioBtn.classList.add('muted');
            muteAllAudio(true);
        }
        
        audioBtn.addEventListener('click', function() {
            const shouldMute = !this.classList.contains('muted');
            
            this.classList.toggle('muted', shouldMute);
            muteAllAudio(shouldMute);
            
            // Update tooltip
            const newTitle = shouldMute ? 'Unmute sound' : 'Mute sound';
            this.setAttribute('title', newTitle);
            const tooltip = bootstrap.Tooltip.getInstance(this);
            if (tooltip) tooltip.setContent({'.tooltip-inner': newTitle});
            
            // Save preference
            localStorage.setItem('gameAudioMuted', shouldMute);
        });
    }
    
    // Home Confirmation
    const homeBtn = document.getElementById('toolbox-home');
    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            new bootstrap.Modal(document.getElementById('homeConfirmationModal')).show();
        });
    }
    
    function muteAllAudio(mute) {
        document.querySelectorAll('audio, video').forEach(media => {
            media.muted = mute;
        });
    }
});


function confirmNavigateHome() {
    window.location.href = "/";
}


let tabHiddenTime = null;
let unfocusedTime = 0;
let unfocusedInterval = null;
let restartShown = false;


document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        tabHiddenTime = Date.now();
        unfocusedInterval = setInterval(() => {
            unfocusedTime += 1;
            // Show restart button after 1 minutes unfocused
            if (unfocusedTime >= 5 && !restartShown) {
                restartShown = true;
                showRestartPopup();
            }
        }, 1000);
    } else {
        if (tabHiddenTime) {
            const hiddenDuration = (Date.now() - tabHiddenTime) / 1000;
            if (hiddenDuration > 30) {
                showUnfocusedAlert(hiddenDuration);
                saveScore(0);
            }
            tabHiddenTime = null;
        }
        clearInterval(unfocusedInterval);
    }
});


function showUnfocusedAlert(duration) {
    alert(`You were not focused on this tab for ${Math.floor(duration)} seconds. Please stay on this tab while playing!`);
}

function showRestartPopup() {
    // Create a simple modal for restart
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';

    modal.innerHTML = `
        <div style="background:#fff;padding:2em;border-radius:8px;text-align:center;max-width:500px;">
            <h5>You have been unfocused for 60 seconds!</h5>
            <p>Please restart the game to continue.</p>
            <button id="restartGameBtn" style="margin-top:1em;" class="btn btn-primary">Restart Game</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('restartGameBtn').onclick = function() {
        window.location.reload();
    };
}


(function() {
    let devtoolsOpen = false;
    const threshold = 160;
    setInterval(function() {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                console.warn('Developer tools are open. Please close them to continue.');
                saveScore(0); // Save score as 0 if devtools are open
            }
        } else {
            devtoolsOpen = false;
        }
    }, 1000);
})();   