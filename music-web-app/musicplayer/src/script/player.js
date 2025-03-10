class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.isLooping = false;
        this.currentSong = null;
        this.playlist = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prevBtn').addEventListener('click', () => this.playPrevious());
        document.getElementById('nextBtn').addEventListener('click', () => this.playNext());
        document.getElementById('loopBtn').addEventListener('click', () => this.toggleLoop());
        document.getElementById('progressBar').addEventListener('change', (e) => this.seek(e.target.value));
    }

    loadSong(song) {
        this.currentSong = song;
        this.audio.src = song.url;
        this.updatePlayerUI();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayerUI();
    }

    playPrevious() {
        // Implement previous song logic
    }

    playNext() {
        // Implement next song logic
    }

    toggleLoop() {
        this.isLooping = !this.isLooping;
        this.audio.loop = this.isLooping;
        document.getElementById('loopBtn').classList.toggle('text-green-500');
    }

    seek(value) {
        const time = (value * this.audio.duration) / 100;
        this.audio.currentTime = time;
    }

    updatePlayerUI() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        playPauseBtn.innerHTML = this.isPlaying ? 
            '<i class="fas fa-pause"></i>' : 
            '<i class="fas fa-play"></i>';

        if (this.currentSong) {
            document.getElementById('currentSongTitle').textContent = this.currentSong.title;
            document.getElementById('currentArtist').textContent = this.currentSong.artist;
            document.getElementById('currentSongImg').src = this.currentSong.coverArt;
        }
    }
}