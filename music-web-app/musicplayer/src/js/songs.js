let currentlyPlayingSong = null;
let allSongs = [];

async function fetchSongs() {
    document.getElementById('loading').classList.remove('hidden');
    try {
        const response = await fetch('https://sonix-s830.onrender.com/api/songs');
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }

        allSongs = await response.json();
        allSongs = shuffleArray(allSongs);
        displaySongs(allSongs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        document.getElementById('message').textContent = 'Failed to load songs. Please try again later.';
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

function shuffleArray(songs) {
    for (let i = songs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [songs[i], songs[j]] = [songs[j], songs[i]]; // Swap elements
    }
    return songs;
}

function displaySongs(songs) {
    const songList = document.getElementById('songsList');
    songList.innerHTML = '';

    songs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group p-4';

        const songId = `song-${song.title.replace(/\s+/g, '-')}`;

        songItem.innerHTML = `
        <div class="cursor-pointer -z-20">
            <div class="relative" onclick="playSong('${song.songUrl}', '${song.title}', '${song.artistName}', '${song.previewImg}', '${songId}')">
                <img src="${song.previewImg}" alt="${song.title}" class="w-full h-40 aspect-square object-cover">
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button id="${songId}-playBtn" class="bg-purple-500 text-white p-4 rounded-full hover:bg-purple-600 transform hover:scale-110 transition-all">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <h2 class="text-lg font-bold truncate">${song.title}</h2>
            <p class="text-gray-400 text-sm truncate mb-2">${song.artistName}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">${song.genre}</span>
                <div class="flex gap-3">
                    <button class="text-gray-400 hover:text-purple-500 transition" onclick="addToFav('${song.title}')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="text-gray-400 hover:text-purple-500 transition">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
        songList.appendChild(songItem);
    });
}

function addToFav(title) {
    console.log(`${title} is added in favourites❤️`);
    
}


function playSong(url, title, artist, imgSrc, songId) {
    document.getElementById('currentSongTitle').textContent = title;
    document.getElementById('currentArtist').textContent = artist;
    document.getElementById('currentSongImg').src = imgSrc;
    document.getElementById('current-song').src = url;
}

function searchSongs(event) {
    const searchInput = event.target.value.toLowerCase();
    const filteredSongs = allSongs.filter(song => 
        song.title.toLowerCase().includes(searchInput) ||
        song.artistName.toLowerCase().includes(searchInput) ||
        song.genre.toLowerCase().includes(searchInput)
    );
    displaySongs(filteredSongs);
}

// Call fetchSongs when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSongs();
    // Add search event listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchSongs);
    }
});