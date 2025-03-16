document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('Current user:', user); // Debug log

    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userProfile = document.getElementById('userProfile');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (user && user.id) { // Check if user and user.id exist
        console.log('User is logged in with ID:', user.id); // Debug log
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        usernameDisplay.textContent = user.username;

        // Fetch user's playlists when logged in
        fetchUserPlaylists(user.id);

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                sessionStorage.removeItem('user');
                window.location.href = 'login.html';
            });
        }

        // Setup playlist creation functionality
        setupPlaylistCreation(user);
    } else {
        console.log('No user logged in or missing user ID'); // Debug log
        loginBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
        userProfile.style.display = 'none';
    }
});

function setupPlaylistCreation(user) {
    const createPlaylistBtn = document.getElementById('createPlaylist');
    const newPlaylistSection = document.getElementById('newPlaylist');
    
    console.log('Setting up playlist creation...'); // Debug log
    console.log('Create button found:', !!createPlaylistBtn); // Debug log
    console.log('New playlist section found:', !!newPlaylistSection); // Debug log

    if (!createPlaylistBtn || !newPlaylistSection) {
        console.error('Could not find playlist elements');
        return;
    }

    // Remove any existing event listeners
    const newBtn = createPlaylistBtn.cloneNode(true);
    createPlaylistBtn.parentNode.replaceChild(newBtn, createPlaylistBtn);

    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Create playlist clicked'); // Debug log
        newPlaylistSection.classList.toggle('hidden');
        const input = newPlaylistSection.querySelector('input');
        if (input && !newPlaylistSection.classList.contains('hidden')) {
            input.focus();
        }
    });

    const playlistInput = newPlaylistSection.querySelector('input');
    if (playlistInput) {
        playlistInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const playlistName = this.value.trim();
                if (playlistName) {
                    console.log('Creating playlist with name:', playlistName); // Debug log
                    createNewPlaylist(playlistName, user.id);
                    this.value = '';
                    newPlaylistSection.classList.add('hidden');
                }
            }
        });
    }
}

async function createNewPlaylist(playlistName, userId) {
    try {
        console.log('Creating playlist:', playlistName, 'for user:', userId); // Debug log
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
        console.log('API Response:', data); // Debug log

        if (!response.ok) {
            throw new Error(`Failed to create playlist: ${data.message || 'Unknown error'}`);
        }

        // After successful creation, fetch updated playlists
        await fetchUserPlaylists(userId);
    } catch (error) {
        console.error('Error creating playlist:', error);
        alert('Failed to create playlist: ' + error.message);
    }
}

async function fetchUserPlaylists(userId) {
    try {
        console.log('Fetching playlists for user:', userId); // Debug log
        const response = await fetch(`https://sonix-s830.onrender.com/api/playlists/user/${userId}`, {
            headers: {
                'accept': '*/*'
            }
        });

        const data = await response.json();
        console.log('Playlists API Response:', data); // Debug log

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
    console.log('Display playlists container found:', !!playlistsContainer); // Debug log
    console.log('Playlists to display:', playlists); // Debug log

    if (!playlistsContainer) {
        console.error('Could not find playlists container');
        return;
    }

    // Create a new container for playlist items
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

    // Find the existing playlists container and replace its contents
    const existingContent = playlistsContainer.querySelector('div > div');
    if (existingContent) {
        existingContent.replaceWith(playlistItemsContainer);
    } else {
        playlistsContainer.querySelector('div').appendChild(playlistItemsContainer);
    }
}

// Keep the health check ping
setInterval(() => {
    fetch('https://sonix-s830.onrender.com/api/health')
         .then(response => console.log("Pinged Render backend:", response.status))
         .catch(error => console.error("Error pinging Render:", error));
}, 300000);