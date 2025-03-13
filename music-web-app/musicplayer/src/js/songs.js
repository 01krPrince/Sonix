// Fetch songs from the API and display them
async function fetchSongs() {
    document.getElementById('loading').classList.remove('hidden'); // Show loading
    try {
        const response = await fetch('https://sonix-s830.onrender.com/api/songs'); // Updated API URL
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }

        const songs = await response.json();
        displaySongs(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        document.getElementById('message').textContent = 'Failed to load songs. Please try again later.';
    } finally {
        document.getElementById('loading').classList.add('hidden'); // Hide loading
    }
}

// Display songs dynamically
function displaySongs(songs) {
    const songList = document.getElementById('songsList');

    // Clear previous songs
    songList.innerHTML = '';

    songs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group p-4';

        songItem.innerHTML = `
            <div class="relative">
                <img src="${song.previewImg}" alt="${song.title}" class="w-full h-40 aspect-square object-cover">
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="bg-purple-500 text-white p-4 rounded-full hover:bg-purple-600 transform hover:scale-110 transition-all" onclick="playSong('${song.songUrl}')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <h2 class="text-lg font-bold truncate">${song.title}</h2>
            <p class="text-gray-400 text-sm truncate mb-2">${song.artistName}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">${song.genre}</span>
                <div class="flex gap-3">
                    <button class="text-gray-400 hover:text-purple-500 transition">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="text-gray-400 hover:text-purple-500 transition">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;

        songList.appendChild(songItem);
    });
}

// Function to play a song
function playSong(url) {
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = url;
    audioPlayer.play();
}

// Call fetchSongs when the page loads
document.addEventListener('DOMContentLoaded', fetchSongs);