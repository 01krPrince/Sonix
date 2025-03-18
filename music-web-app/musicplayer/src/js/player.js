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
        
        // Add volume control listeners
        const volumeControl = document.querySelector('input[type="range"]');
        volumeControl.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Add mute button listener
        document.querySelector('.fa-volume-up').parentElement.addEventListener('click', () => this.toggleMute());
        
        // Add playlist creation listener
        document.querySelector('.fa-plus').parentElement.addEventListener('click', () => this.createPlaylist());
        
        // Update progress bar during playback
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
        
        // Update volume icon
        volumeIcon.className = this.isMuted ? 'fas fa-volume-mute' :
            this.volume === 0 ? 'fas fa-volume-off' :
            this.volume < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up';
        
        // Update slider
        volumeSlider.value = this.isMuted ? 0 : this.volume * 100;
    }

    // createPlaylist() {
    //     const playlistContainer = document.querySelector('.overflow-y-auto');
    //     const inputSection = document.createElement('div');
    //     inputSection.className = 'mb-4 p-3 bg-white/5 rounded-lg';
    //     inputSection.innerHTML = `
    //         <div class="flex gap-2">
    //             <input type="text" class="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter playlist name">
    //             <button class="bg-purple-500 px-4 rounded-lg hover:bg-purple-600 transition">
    //                 <i class="fas fa-check"></i>
    //             </button>
    //             <button class="bg-gray-500 px-4 rounded-lg hover:bg-gray-600 transition">
    //                 <i class="fas fa-times"></i>
    //             </button>
    //         </div>
    //     `;

    //     const existingInput = playlistContainer.querySelector('.mb-4.p-3.bg-white\/5');
    //     if (existingInput) {
    //         existingInput.remove();
    //         return;
    //     }

    //     playlistContainer.insertBefore(inputSection, playlistContainer.firstChild);

    //     const input = inputSection.querySelector('input');
    //     const confirmBtn = inputSection.querySelector('.fa-check').parentElement;
    //     const cancelBtn = inputSection.querySelector('.fa-times').parentElement;

    //     input.focus();

    //     confirmBtn.addEventListener('click', () => {
    //         const playlistName = input.value.trim();
    //         if (playlistName) {
    //             const playlistId = `playlist-${Date.now()}`;
    //             const playlistHTML = `
    //                 <div class="mb-4">
    //                     <button class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/10 transition"
    //                         onclick="togglePlaylist('${playlistId}')">
    //                         <div class="flex items-center gap-3">
    //                             <i class="fas fa-music text-purple-500"></i>
    //                             <span>${playlistName}</span>
    //                         </div>
    //                         <i id="${playlistId}-icon" class="fas fa-chevron-down transition"></i>
    //                     </button>
    //                     <div id="${playlistId}" class="hidden pl-8 mt-2 space-y-2">
    //                         <div class="text-gray-400 text-sm">No songs in playlist</div>
    //                     </div>
    //                 </div>`;
    //             inputSection.insertAdjacentHTML('afterend', playlistHTML);
    //             inputSection.remove();
    //         }
    //     });

    //     cancelBtn.addEventListener('click', () => {
    //         inputSection.remove();
    //     });

    //     input.addEventListener('keyup', (e) => {
    //         if (e.key === 'Enter') {
    //             confirmBtn.click();
    //         } else if (e.key === 'Escape') {
    //             cancelBtn.click();
    //         }
    //     });
    // }

    // setupPlaylistCreation() {
    //     const addPlaylistBtn = document.querySelector('.fa-plus').parentElement;
    //     addPlaylistBtn.addEventListener('click', () => this.createPlaylist());
    // }

    // createPlaylist() {
    //     const playlistContainer = document.querySelector('.overflow-y-auto');
    //     const inputSection = document.createElement('div');
    //     inputSection.className = 'mb-4 p-3 bg-white/5 rounded-lg';
    //     inputSection.innerHTML = `
    //         <div class="flex gap-2">
    //             <input type="text" class="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter playlist name">
    //             <button class="bg-purple-500 px-4 rounded-lg hover:bg-purple-600 transition">
    //                 <i class="fas fa-check"></i>
    //             </button>
    //             <button class="bg-gray-500 px-4 rounded-lg hover:bg-gray-600 transition">
    //                 <i class="fas fa-times"></i>
    //             </button>
    //         </div>
    //     `;

    //     const existingInput = playlistContainer.querySelector('.mb-4.p-3.bg-white\/5');
    //     if (existingInput) {
    //         existingInput.remove();
    //         return;
    //     }

    //     playlistContainer.insertBefore(inputSection, playlistContainer.firstChild);

    //     const input = inputSection.querySelector('input');
    //     const confirmBtn = inputSection.querySelector('.fa-check').parentElement;
    //     const cancelBtn = inputSection.querySelector('.fa-times').parentElement;

    //     input.focus();

    //     confirmBtn.addEventListener('click', () => {
    //         const playlistName = input.value.trim();
    //         if (playlistName) {
    //             const playlistId = `playlist-${Date.now()}`;
    //             const playlistHTML = `
    //                 <div class="mb-4">
    //                     <button class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/10 transition"
    //                         onclick="togglePlaylist('${playlistId}')">
    //                         <div class="flex items-center gap-3">
    //                             <i class="fas fa-music text-purple-500"></i>
    //                             <span>${playlistName}</span>
    //                         </div>
    //                         <i id="${playlistId}-icon" class="fas fa-chevron-down transition"></i>
    //                     </button>
    //                     <div id="${playlistId}" class="hidden pl-8 mt-2 space-y-2">
    //                         <div class="text-gray-400 text-sm">No songs in playlist</div>
    //                     </div>
    //                 </div>`;
    //             inputSection.insertAdjacentHTML('afterend', playlistHTML);
    //             inputSection.remove();
    //         }
    //     });

    //     cancelBtn.addEventListener('click', () => {
    //         inputSection.remove();
    //     });

    //     input.addEventListener('keyup', (e) => {
    //         if (e.key === 'Enter') {
    //             confirmBtn.click();
    //         } else if (e.key === 'Escape') {
    //             cancelBtn.click();
    //         }
    //     });
    // }

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