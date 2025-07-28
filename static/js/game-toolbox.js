document.addEventListener('DOMContentLoaded', function() {
    // Initialize all toolbox functionality
    initToolbox();
    
    // Initialize tooltips and audio controls
    initTooltips();
    initAudioControls();
    
    // Initialize home button confirmation
    initHomeButton();

    // Initialize page reload prevention
    initReloadPrevention();

});



function initToolbox() {
    const toolboxToggle = document.getElementById('toolbox-toggle');
    const toolbox = document.querySelector('.game-toolbox');
    
    if (!toolboxToggle || !toolbox) return;
    
    // Toggle toolbox visibility
    toolboxToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toolbox.classList.toggle('show');
        this.classList.toggle('rotate');
    });
    
    // Close toolbox when clicking outside
    document.addEventListener('click', function() {
        if (toolbox.classList.contains('show')) {
            toolbox.classList.remove('show');
            toolboxToggle.classList.remove('rotate');
        }
    });
    
    // Prevent toolbox from closing when clicking inside it
    toolbox.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('.toolbox-btn[title]'));
    tooltipTriggerList.forEach(function(tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl, {
            placement: 'left',
            trigger: 'hover'
        });
    });
}

function initAudioControls() {
    const audioBtn = document.getElementById('toolbox-audio');
    if (!audioBtn) return;
    
    // Check initial mute state from localStorage
    const isMuted = localStorage.getItem('gameAudioMuted') === 'true';
    if (isMuted) {
        audioBtn.classList.add('muted');
        muteAllAudio(true);
    }
    
    audioBtn.addEventListener('click', function() {
        const shouldMute = !this.classList.contains('muted');
        
        // Toggle mute state
        this.classList.toggle('muted', shouldMute);
        muteAllAudio(shouldMute);
        
        // Update tooltip
        updateTooltip(this, shouldMute ? 'Unmute sound' : 'Mute sound');
        
        // Save preference
        localStorage.setItem('gameAudioMuted', shouldMute);
    });
}

function initHomeButton() {
    const homeBtn = document.getElementById('toolbox-home');
    if (!homeBtn) return;
    
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


function initReloadPrevention() {
    const reloadModal = new bootstrap.Modal(document.getElementById('reloadConfirmationModal'));
    let isConfirmed = false;

    // Event listener untuk tombol konfirmasi
    document.getElementById('confirmReload')?.addEventListener('click', function() {
        isConfirmed = true;
        reloadModal.hide();
        window.location.reload();
    });

    // Tambahkan event listeners untuk pencegahan reload
    window.addEventListener('beforeunload', function(e) {
        if (!isConfirmed) {
            e.preventDefault();
            // Tampilkan modal
            reloadModal.show();
        }
    });

    // Untuk form submission jika perlu
    document.addEventListener('submit', function() {
        isConfirmed = true;
    });
}


function updateTooltip(element, newTitle) {
    element.setAttribute('title', newTitle);
    const tooltip = bootstrap.Tooltip.getInstance(element);
    if (tooltip) {
        tooltip.setContent({'.tooltip-inner': newTitle});
    }
}

// Global function for home confirmation
function confirmNavigateHome() {
    window.location.href = "/";
}