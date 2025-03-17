function togglePlaylist(playlistId) {
    const playlist = document.getElementById(playlistId);
    const icon = document.getElementById(`${playlistId}-icon`);
    if (playlist && icon) {
        playlist.classList.toggle('hidden');
        icon.style.transform = playlist.classList.contains('hidden') ?
            'rotate(0deg)' : 'rotate(180deg)';
    }
}

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
        }
    });

    input.addEventListener('keyup', function (e) {
        if (e.key === "Escape") {
            newPlaylistDiv.classList.add("hidden");
            input.value = "";
        }
    });
}

function addNewPlaylist(playlistName) {
    const playlistContainer = document.querySelector('.overflow-y-auto');
    
    const playlistId = `playlist-${Date.now()}`;
    const playlistHTML = `
        <div class="mb-4">
            <button class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/10 transition"
                onclick="togglePlaylist('${playlistId}')">
                <div class="flex items-center gap-3">
                    <i class="fas fa-music text-purple-500"></i>
                    <span>${playlistName}</span>
                </div>
                <i id="${playlistId}-icon" class="fas fa-chevron-down transition"></i>
            </button>
            <div id="${playlistId}" class="hidden pl-8 mt-2 space-y-2">
                <div class="text-gray-400 text-sm">No songs in playlist</div>
            </div>
        </div>
    `;

    playlistContainer.insertAdjacentHTML('beforeend', playlistHTML);
}

document.addEventListener('DOMContentLoaded', setupPlaylistHandlers);


function setupPlaylistCreation(user) {
    const createPlaylistBtn = document.getElementById('createPlaylist');
    const newPlaylistSection = document.getElementById('newPlaylist');
    
    console.log('Setting up playlist creation...');
    console.log('Create button found:', !!createPlaylistBtn);
    console.log('New playlist section found:', !!newPlaylistSection);

    if (!createPlaylistBtn || !newPlaylistSection) {
        console.error('Could not find playlist elements');
        return;
    }

    const newBtn = createPlaylistBtn.cloneNode(true);
    createPlaylistBtn.parentNode.replaceChild(newBtn, createPlaylistBtn);

    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Create playlist clicked');
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
                    console.log('Creating playlist with name:', playlistName);
                    const createdPlaylist = await createNewPlaylist(playlistName, user.id);
                    if (createdPlaylist) {
                        displayNewPlaylist(createdPlaylist);
                        this.value = ''; // Clear the input
                        newPlaylistSection.classList.add('hidden'); // Hide the input section again
                    }
                }
            }
        });
    }
}

async function createNewPlaylist(playlistName, userId) {
    try {
        console.log('Creating playlist:', playlistName, 'for user:', userId);
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
        console.log('API Response:', data);

        if (!response.ok) {
            throw new Error(`Failed to create playlist: ${data.message || 'Unknown error'}`);
        }

        return data; // Return the created playlist object
    } catch (error) {
        console.error('Error creating playlist:', error);
        alert('Failed to create playlist: ' + error.message);
        return null; // Return null if the playlist creation failed
    }
}

function displayNewPlaylist(playlist) {
    const playlistsContainer = document.querySelector('.bg-white\\/5.backdrop-blur-lg');
    console.log('Display playlists container found:', !!playlistsContainer);
    console.log('New playlist to display:', playlist);

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

    const playlistItemsContainer = playlistsContainer.querySelector('div');
    if (playlistItemsContainer) {
        playlistItemsContainer.insertAdjacentHTML('beforeend', playlistHTML); // Add the new playlist to the container
    }
}

async function fetchUserPlaylists(userId) {
    try {
        console.log('Fetching playlists for user:', userId);
        const response = await fetch(`https://sonix-s830.onrender.com/api/playlists/user/${userId}`, {
            headers: {
                'accept': '*/*'
            }
        });

        const data = await response.json();
        console.log('Playlists API Response:', data);

        if (!response.ok) {
            throw new Error(`Failed to fetch playlists: ${data.message || 'Unknown error'}`);
        }

        displayPlaylists(data);
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
}

function displayPlaylists(playlists) {
    const playlistsContainer = document.querySelector('.bg-white\\/5.backdrop-blur-lg');
    console.log('Display playlists container found:', !!playlistsContainer);
    console.log('Playlists to display:', playlists);

    if (!playlistsContainer) {
        console.error('Could not find playlists container');
        return;
    }

    const playlistItemsContainer = document.createElement('div');
    playlistItemsContainer.className = '';

    if (!Array.isArray(playlists) || playlists.length === 0) {
        playlistItemsContainer.innerHTML = `
            <div class="text-gray-400 text-sm p-3">No playlists yet</div>
        `;
    } else {
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
            playlistItemsContainer.insertAdjacentHTML('beforeend', playlistHTML);
        });
    }

    const existingContent = playlistsContainer.querySelector('div > div');
    if (existingContent) {
        existingContent.replaceWith(playlistItemsContainer);
    } else {
        playlistsContainer.querySelector('div').appendChild(playlistItemsContainer);
    }
}