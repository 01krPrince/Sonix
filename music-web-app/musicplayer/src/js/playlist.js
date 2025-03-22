let favoritePlaylist = null;
window.favoritePlaylist = favoritePlaylist;

document.addEventListener('DOMContentLoaded', () => {
    setupPlaylistHandlers();
});

function setupPlaylistHandlers() {
    const addPlaylistBtn = document.getElementById('createPlaylist');
    if (addPlaylistBtn) {
        addPlaylistBtn.addEventListener('click', createPlaylist);
    }
}

function createPlaylist() {
    const newPlaylistDiv = document.getElementById("newPlaylist");

    newPlaylistDiv.classList.toggle("hidden");

    const input = newPlaylistDiv.querySelector('input');
    input.focus();

    input.addEventListener('keyup', function (e) {
        if (e.key === "Enter") {
            const playlistName = input.value.trim();
            if (playlistName) {
                addNewPlaylist(playlistName);
                newPlaylistDiv.classList.add("hidden");
                input.value = "";
            }
        } else if (e.key === "Escape") {
            newPlaylistDiv.classList.add("hidden");
            input.value = "";
        }
    });
}

function setupPlaylistCreation(user) {
    const createPlaylistBtn = document.getElementById('createPlaylist');
    const newPlaylistSection = document.getElementById('newPlaylist');

    if (!createPlaylistBtn || !newPlaylistSection) {
        console.error('Could not find playlist elements');
        return;
    }

    createPlaylistBtn.addEventListener('click', function(e) {
        e.preventDefault();
        newPlaylistSection.classList.toggle('hidden');
        const input = newPlaylistSection.querySelector('input');
        if (input && !newPlaylistSection.classList.contains('hidden')) {
            input.focus();
        }
    });

    const playlistInput = newPlaylistSection.querySelector('input');
    if (playlistInput) {
        playlistInput.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {
                const playlistName = this.value.trim();
                if (playlistName) {
                    const createdPlaylist = await createNewPlaylist(playlistName, user.id);
                    if (createdPlaylist) {
                        displayNewPlaylist(createdPlaylist);
                        this.value = ''; 
                        newPlaylistSection.classList.add('hidden'); 
                    }
                }
            }
        });
    }
}

async function createNewPlaylist(playlistName, userId) {
    try {
        const response = await fetch('https://sonix-s830.onrender.com/api/playlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            body: JSON.stringify({
                userId: userId,
                playlistName: playlistName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to create playlist: ${data.message || 'Unknown error'}`);
        }

        return data;
    } catch (error) {
        console.error('Error creating playlist:', error);
        alert('Failed to create playlist: ' + error.message);
        return null;
    }
}

function displayNewPlaylist(playlist) {
    const playlistsContainer = document.querySelector('.bg-white\\/5.backdrop-blur-lg');

    if (!playlistsContainer) {
        console.error('Could not find playlists container');
        return;
    }

    const playlistHTML = `
        <div class="mb-4">
            <button class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/10 transition">
                <div class="flex items-center gap-3">
                    <i class="fas fa-music text-purple-500"></i>
                    <span>${playlist.playlistName}</span>
                </div>
            </button>
            <div class="hidden pl-4 mt-2 space-y-2">
                <div class="text-gray-400 text-sm">No songs in playlist</div>
            </div>
        </div>
    `;

    playlistsContainer.insertAdjacentHTML('beforeend', playlistHTML);
}

async function fetchUserPlaylists(userId) {
    try {
        const response = await fetch(`https://sonix-s830.onrender.com/api/playlists/user/${userId}`, {
            headers: {
                'accept': '*/*'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to fetch playlists: ${data.message || 'Unknown error'}`);
        }

        if (data.length > 0) {
            favoritePlaylist = data[0];
        }

        displayPlaylists(data);
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
}

function displayPlaylists(playlists) {
    const playlistsContainer = document.querySelector('.bg-white\\/5.backdrop-blur-lg');

    if (!playlistsContainer) {
        console.error('Could not find playlists container');
        return;
    }

    playlistsContainer.innerHTML = "";

    playlists.forEach(playlist => {
        const playlistHTML = `
            <div class="mb-4">
                <button class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/10 transition">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-music text-purple-500"></i>
                        <span>${playlist.playlistName}</span>
                    </div>
                </button>
                <div class="hidden pl-4 mt-2 space-y-2">
                    <div class="text-gray-400 text-sm">No songs in playlist</div>
                </div>
            </div>
        `;
        playlistsContainer.insertAdjacentHTML('beforeend', playlistHTML);
    });
}

async function toggleFav(songId) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        alert("Log in to add favorites.")
        return;
    }
    if (!favoritePlaylist) {
        alert("No favorite playlist found. Please create one first.");
        return;
    }

    let isExists = favoritePlaylist.playlistSongs.includes(songId);    
    const heartButton = document.getElementById(`heart-${songId}`);
    
    try {
        const addSongResponse = await fetch(`https://sonix-s830.onrender.com/api/playlists/${favoritePlaylist.id}/songs/${songId}`, {
            method: isExists ? 'DELETE' : 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            }
        });

        if (!addSongResponse.ok) {
            throw new Error(`Failed to ${isExists ? 'remove' : 'add'} song: ${await addSongResponse.text()}`);
        }

        // Update the local favoritePlaylist state
        if (isExists) {
            favoritePlaylist.playlistSongs = favoritePlaylist.playlistSongs.filter(id => id !== songId);
            console.log(`⭐ Removed from favorites: 🎵 Song Id: ${songId}`);
            // Update UI to show unfavorited state
            heartButton.classList.remove('text-purple-600');
            heartButton.classList.add('text-gray-400', 'hover:text-purple-500');
        } else {
            favoritePlaylist.playlistSongs.push(songId);
            console.log(`⭐ Added to favorites: 🎵 Song Id: ${songId}`);
            // Update UI to show favorited state
            heartButton.classList.remove('text-gray-400', 'hover:text-purple-500');
            heartButton.classList.add('text-purple-600');
        }

    } catch (error) {
        console.error("Error toggling favorite:", error);
        alert(`Failed to ${isExists ? 'remove' : 'add'} song to favorites: ${error.message}`);
    }
}



