document.addEventListener('DOMContentLoaded', () => {
    // Sample song data - in a real app, this would come from an API
    const songs = [
        {
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            cover: 'https://i.scdn.co/image/ab67616d00004851ed0015021adb8c73654d4886'
        },
        {
            title: 'Levitating',
            artist: 'Dua Lipa',
            cover: 'https://i.scdn.co/image/ab67616d00004851019e34651a4c685f2bce37a9'
        },
        {
            title: 'Stay With Me',
            artist: 'Sam Smith',
            cover: 'https://i.scdn.co/image/ab67616d00004851d9194aa18fa4c9362b47464f'
        },
        {
            title: 'Circles',
            artist: 'Post Malone',
            cover: 'https://i.scdn.co/image/ab67616d0000485113f2466b83507515291acce4'
        }
    ];

    const songsList = document.getElementById('songsList');
    const template = document.getElementById('song-card-template');
    const searchInput = document.getElementById('searchInput');

    // Function to create song cards
    function createSongCard(song) {
        const clone = template.content.cloneNode(true);
        
        const img = clone.querySelector('img');
        const title = clone.querySelector('.song-title');
        const artist = clone.querySelector('.artist-name');
        
        img.src = song.cover;
        img.alt = `${song.title} cover`;
        title.textContent = song.title;
        artist.textContent = song.artist;

        const playBtn = clone.querySelector('.play-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Add play functionality here
            console.log(`Playing ${song.title}`);
        });

        return clone;
    }

    // Initial render of all songs
    function renderSongs(songsToRender) {
        songsList.innerHTML = '';
        songsToRender.forEach(song => {
            songsList.appendChild(createSongCard(song));
        });
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredSongs = songs.filter(song => 
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        );
        renderSongs(filteredSongs);
    });

    // Initial render
    renderSongs(songs);
});