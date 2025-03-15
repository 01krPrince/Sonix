const initializeTheme = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', darkMode);
};

const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark);
};

const checkAuth = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
};

const fetchUserProfile = async () => {
    const user = checkAuth();
    if (!user) return;

    try {
        displayUserProfile(user);

        const response = await fetch('https://sonix-s830.onrender.com/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        displayUserProfile(userData);
        
        await fetchPlaylists();
        await fetchFavorites();
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};

const displayUserProfile = (userData) => {
    const usernameElement = document.getElementById('username');
    const userEmailElement = document.getElementById('userEmail');
    
    if (usernameElement) {
        usernameElement.textContent = userData.username || 'Username not available';
    }
    if (userEmailElement) {
        userEmailElement.textContent = userData.email || 'Email not available';
    }
};

const fetchPlaylists = async () => {
    const user = checkAuth();
    if (!user) return;

    try {
        const response = await fetch('https://sonix-s830.onrender.com/api/playlists', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch playlists');
        }

        const playlists = await response.json();
        displayPlaylists(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
};

const displayPlaylists = (playlists) => {
    const container = document.getElementById('playlistsContainer');
    if (!container) return;

    if (!playlists || playlists.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 dark:text-gray-400 py-4">
                <p>No playlists created yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = playlists.map(playlist => `
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer">
            <div class="flex items-center gap-3">
                <i class="fas fa-list-ul text-primary-dark"></i>
                <div>
                    <h4 class="font-medium">${playlist.name}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${playlist.songs.length} songs</p>
                </div>
            </div>
            <button class="text-gray-500 hover:text-primary-dark transition">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `).join('');
};

const fetchFavorites = async () => {
    const user = checkAuth();
    if (!user) return;

    try {
        const response = await fetch('https://sonix-s830.onrender.com/api/favorites', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }

        const favorites = await response.json();
        displayFavorites(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }
};

const displayFavorites = (favorites) => {
    const container = document.getElementById('favoritesContainer');
    if (!container) return;

    if (!favorites || favorites.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 dark:text-gray-400 py-4">
                <p>No favorite songs yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = favorites.map(song => `
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer">
            <div class="flex items-center gap-3">
                <img src="${song.thumbnail || 'assets/default-song-preview.png'}" alt="${song.title}" class="w-10 h-10 rounded object-cover">
                <div>
                    <h4 class="font-medium">${song.title}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${song.artist}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button class="text-gray-500 hover:text-primary-dark transition">
                    <i class="fas fa-play"></i>
                </button>
                <button class="text-red-500 hover:text-red-600 transition">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
};

const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
};

const createPlaylist = async (name) => {
    const user = checkAuth();
    if (!user) return;

    try {
        const response = await fetch('https://sonix-s830.onrender.com/api/playlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ name })
        });

        if (!response.ok) {
            throw new Error('Failed to create playlist');
        }

        await fetchPlaylists();
    } catch (error) {
        console.error('Error creating playlist:', error);
        alert('Failed to create playlist');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();
    
    // Fetch profile data
    fetchUserProfile();
    
    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Edit profile button
    const editProfileBtn = document.querySelector('button[data-action="edit-profile"]');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const newUsername = prompt('Enter new username:');
            if (newUsername) {
                updateProfile({ username: newUsername });
            }
        });
    }

    // Create playlist button
    const createPlaylistBtn = document.querySelector('button:contains("Create New Playlist")');
    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', () => {
            const name = prompt('Enter playlist name:');
            if (name) {
                createPlaylist(name);
            }
        });
    }
});