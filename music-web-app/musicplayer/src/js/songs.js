let currentlyPlayingSong = null;
let allSongs = [];
let showingFavorites = false;

async function fetchSongs() {
    document.getElementById('loading').classList.remove('hidden');
    try {
        // First fetch the user's favorite playlist if they are logged in
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            try {
                const response = await fetch(`https://sonix-s830.onrender.com/api/playlists/user/${user.id}`, {
                    headers: {
                        'accept': '*/*'
                    }
                });
                const data = await response.json();
                if (response.ok && data.length > 0) {
                    window.favoritePlaylist = data[0];
                }
            } catch (error) {
                console.error('Error fetching favorite playlist:', error);
            }
        }

        // Then fetch all songs
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

    if (songs.length === 0) {
        songList.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                <p>${showingFavorites ? 'No favorite songs yet' : 'No songs found'}</p>
            </div>
        `;
        return;
    }

    songs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group p-4';

        const songId = `song-${song.title.replace(/\s+/g, '-')}`;
        const heartButtonId = `heart-${song.id}`;

        songItem.innerHTML = `
        <div class="cursor-pointer -z-20">
            <div class="relative" onclick="playSong('${song.songUrl}', '${song.title.replace(/'/g, "\\'")}', '${song.artistName.replace(/'/g, "\\'")}', '${song.previewImg}', '${songId}')">
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
                    <button id="${heartButtonId}" class="text-gray-400 hover:text-purple-500 transition" 
                        onclick="toggleFav('${song.id}')">
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

    // Update heart icons after displaying songs
    updateHeartIcons();
}

function updateHeartIcons() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) return;

    // First, reset all heart buttons to default state
    document.querySelectorAll('[id^="heart-"]').forEach(button => {
        button.classList.remove('text-purple-600');
        button.classList.add('text-gray-400', 'hover:text-purple-500');
    });
    
    // Then, set the favorited state for songs in favorites
    if (window.favoritePlaylist && window.favoritePlaylist.playlistSongs) {
        window.favoritePlaylist.playlistSongs.forEach(songId => {
            const heartButton = document.getElementById(`heart-${songId}`);
            if (heartButton) {
                heartButton.classList.remove('text-gray-400', 'hover:text-purple-500');
                heartButton.classList.add('text-purple-600');
            }
        });
    }
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

function toggleFavorites() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        alert("Please log in to view favorites");
        return;
    }

    showingFavorites = !showingFavorites;
    const favoritesBtn = document.getElementById('favoritesBtn');
    
    if (showingFavorites) {
        // Show only favorite songs
        const favoriteSongs = allSongs.filter(song => 
            window.favoritePlaylist && window.favoritePlaylist.playlistSongs.includes(song.id)
        );
        displaySongs(favoriteSongs);
        favoritesBtn.classList.add('bg-white/10');
    } else {
        // Show all songs
        displaySongs(allSongs);
        favoritesBtn.classList.remove('bg-white/10');
    }
}

// Call fetchSongs when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSongs();
    // Add search event listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchSongs);
    }
    // Add favorites button click handler
    const favoritesBtn = document.getElementById('favoritesBtn');
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', toggleFavorites);
        // Check if user is logged in and show favorites by default
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            toggleFavorites();
        }
    }
});