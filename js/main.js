// Music functionality for the landing page
document.addEventListener('DOMContentLoaded', function() {
    const musicToggle = document.getElementById('music-toggle');
    const audio = document.getElementById('background-music');
    const enterStoreBtn = document.getElementById('enter-store');

    // Array of music tracks
    const tracks = [
        'music/track1.mp3',
        'music/track2.mp3',
        'music/track3.mp3'
    ];

    // Select a random track
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    audio.src = randomTrack;

    let isPlaying = false;

    // Music toggle functionality
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            musicToggle.textContent = 'Play Metal';
        } else {
            audio.play().catch(error => {
                console.log('Audio play failed:', error);
                // This usually happens due to browser autoplay policies
                alert('Click anywhere on the page first to enable audio');
            });
            musicToggle.textContent = 'Pause Metal';
        }
        isPlaying = !isPlaying;
    });

    // Enable audio on user interaction (to comply with autoplay policies)
    document.body.addEventListener('click', function() {
        if (audio.paused && !isPlaying) {
            // This helps browsers allow audio playback later
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
            }).catch(error => {
                // This is expected to fail initially
            });
        }
    }, { once: true });

    // Navigate to products page
    enterStoreBtn.addEventListener('click', function() {
        window.location.href = 'products.html';
    });
});
