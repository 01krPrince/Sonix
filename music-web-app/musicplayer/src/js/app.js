// // Initialize the music player
// const player = new MusicPlayer();

// // Sample song data for testing
// const sampleSongs = [
//     {
//         title: "Blinding Lights",
//         artist: "The Weeknd",
//         url: "https://example.com/songs/blinding-lights.mp3",
//         coverArt: "https://i.scdn.co/image/ab67616d00004851ed0015021adb8c73654d4886"
//     },
//     {
//         title: "Save Your Tears",
//         artist: "The Weeknd",
//         url: "https://example.com/songs/save-your-tears.mp3",
//         coverArt: "https://i.scdn.co/image/ab67616d00004851ef12a7e0ec3a8d6df2c51f91"
//     }
// ];

// // Add songs to playlist
// player.playlist = sampleSongs;

// // Initialize with first song
// if (sampleSongs.length > 0) {
//     player.loadSong(sampleSongs[0]);
// }

// // Initialize auth
// const auth = new Auth();


setInterval(() => {
    fetch('https://sonix-s830.onrender.com/api/health')
         .then(response => console.log("Pinged Render backend:", response.status))
         .catch(error => console.error("Error pinging Render:", error));
 }, 300000);