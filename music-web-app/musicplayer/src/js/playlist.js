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
    const addPlaylistBtn = document.querySelector('.fa-plus').parentElement;
    if (addPlaylistBtn) {
        addPlaylistBtn.addEventListener('click', createPlaylist);
    }
}

function createPlaylist() {
    const playlistContainer = document.querySelector('.overflow-y-auto');
    const existingInput = playlistContainer.querySelector('.mb-4.p-3.bg-white\/5');
    if (existingInput) {
        existingInput.remove();
        return;
    }

    const inputSection = document.createElement('div');
    inputSection.className = 'mb-4 p-3 bg-white/5 rounded-lg';
    inputSection.innerHTML = `
        <div class="flex gap-2">
            <input type="text" class="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter playlist name">
            <button class="bg-purple-500 px-4 rounded-lg hover:bg-purple-600 transition">
                <i class="fas fa-check"></i>
            </button>
            <button class="bg-gray-500 px-4 rounded-lg hover:bg-gray-600 transition">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    playlistContainer.insertBefore(inputSection, playlistContainer.firstChild);

    const input = inputSection.querySelector('input');
    const confirmBtn = inputSection.querySelector('.fa-check').parentElement;
    const cancelBtn = inputSection.querySelector('.fa-times').parentElement;

    input.focus();

    confirmBtn.addEventListener('click', () => {
        const playlistName = input.value.trim();
        if (playlistName) {
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
                </div>`;
            inputSection.insertAdjacentHTML('afterend', playlistHTML);
            inputSection.remove();
        }
    });

    cancelBtn.addEventListener('click', () => {
        inputSection.remove();
    });

    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            confirmBtn.click();
        } else if (e.key === 'Escape') {
            cancelBtn.click();
        }
    });
}

document.addEventListener('DOMContentLoaded', setupPlaylistHandlers);