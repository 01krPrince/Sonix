class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.isLooping = false;
        this.currentSong = null;
        this.playlist = [];
        this.isMuted = false;
        this.volume = 1;
        this.setupEventListeners();
        this.setupPlaylistCreation();
    }

    setupEventListeners() {
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prevBtn').addEventListener('click', () => this.playPrevious());
        document.getElementById('nextBtn').addEventListener('click', () => this.playNext());
        document.getElementById('loopBtn').addEventListener('click', () => this.toggleLoop());
        document.getElementById('progressBar').addEventListener('change', (e) => this.seek(e.target.value));
        
        const volumeControl = document.querySelector('input[type="range"]');
        volumeControl.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        document.querySelector('.fa-volume-up').parentElement.addEventListener('click', () => this.toggleMute());
        
        document.querySelector('.fa-plus').parentElement.addEventListener('click', () => this.createPlaylist());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
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
        if (this.playlist.length === 0) return;
        const currentIndex = this.playlist.findIndex(song => song === this.currentSong);
        if (currentIndex === -1) {
            this.loadSong(this.playlist[0]);
        } else {
            const prevIndex = (currentIndex - 1 + this.playlist.length) % this.playlist.length;
            this.loadSong(this.playlist[prevIndex]);
        }
        this.audio.play();
        this.isPlaying = true;
        this.updatePlayerUI();
    }

    playNext() {
        if (this.playlist.length === 0) return;
        const currentIndex = this.playlist.findIndex(song => song === this.currentSong);
        if (currentIndex === -1) {
            this.loadSong(this.playlist[0]);
        } else {
            const nextIndex = (currentIndex + 1) % this.playlist.length;
            this.loadSong(this.playlist[nextIndex]);
        }
        this.audio.play();
        this.isPlaying = true;
        this.updatePlayerUI();
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

    setVolume(value) {
        this.volume = value / 100;
        if (!this.isMuted) {
            this.audio.volume = this.volume;
        }
        this.updateVolumeUI();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.volume = this.isMuted ? 0 : this.volume;
        this.updateVolumeUI();
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            progressBar.value = progress;
        }
    }

    updateVolumeUI() {
        const volumeIcon = document.querySelector('.fa-volume-up, .fa-volume-down, .fa-volume-off, .fa-volume-mute');
        const volumeSlider = document.querySelector('input[type="range"]');
        
        volumeIcon.className = this.isMuted ? 'fas fa-volume-mute' :
            this.volume === 0 ? 'fas fa-volume-off' :
            this.volume < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up';
        
        volumeSlider.value = this.isMuted ? 0 : this.volume * 100;
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