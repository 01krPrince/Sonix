package music.example.music_app.service.impl;

import music.example.music_app.model.Playlist;
import music.example.music_app.model.Song;
import music.example.music_app.model.request.CreatePlaylistRequest;
import music.example.music_app.repository.PlaylistRepository;
import music.example.music_app.service.PlaylistService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PlaylistServiceImpl implements PlaylistService {

    private final PlaylistRepository playlistRepository;

    public PlaylistServiceImpl(PlaylistRepository playlistRepository) {
        this.playlistRepository = playlistRepository;
    }

    // Get all playlists
    @Override
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    // Get playlist by ID
    @Override
    public Optional<Playlist> getPlaylistById(String id) {
        return playlistRepository.findById(id);
    }

    // Get playlists by user ID
    @Override
    public List<Playlist> getPlaylistsByUserId(String userId) {
        return playlistRepository.findByUserId(userId);
    }

    // Create a new playlist
    @Override
    public Playlist createPlaylist(CreatePlaylistRequest createPlaylistRequest) {
        Playlist existingPlaylist = playlistRepository.findByPlaylistName(createPlaylistRequest.getPlaylistName().trim());

        if (existingPlaylist != null) {
            throw new RuntimeException("Playlist already exists with name: " + createPlaylistRequest.getPlaylistName());
        }

        Playlist newPlaylist = new Playlist();
        newPlaylist.setPlaylistName(createPlaylistRequest.getPlaylistName().trim());
        newPlaylist.setUserId(createPlaylistRequest.getUserId());

        return playlistRepository.save(newPlaylist);
    }

    // Update existing playlist
    @Override
    public Playlist addSongsInPlaylist(String id, Song song) {
        // Find the playlist by its ID
        return playlistRepository.findById(id).map(existingPlaylist -> {
            // Add the song to the playlist
            List<Song> playlistSongs = existingPlaylist.getPlaylistSongs();
            if (playlistSongs == null) {
                playlistSongs = new ArrayList<>();  // Initialize if null
            }
            playlistSongs.add(song);  // Add the new song
            existingPlaylist.setPlaylistSongs(playlistSongs);  // Set the updated playlist

            // Save and return the updated playlist
            return playlistRepository.save(existingPlaylist);
        }).orElseThrow(() -> new RuntimeException("Playlist not found with id: " + id));
    }

    @Override
    public Playlist deleteSongFromPlaylist(String playlistId, String songId) {
        return playlistRepository.findById(playlistId).map(existingPlaylist -> {
            // Get the list of songs in the playlist
            List<Song> playlistSongs = existingPlaylist.getPlaylistSongs();

            if (playlistSongs != null) {
                // Remove the song with the given songId
                playlistSongs.removeIf(song -> song.getId().equals(songId));  // Remove song by ID
            }

            // Update the playlist with the modified song list
            existingPlaylist.setPlaylistSongs(playlistSongs);

            // Save and return the updated playlist
            return playlistRepository.save(existingPlaylist);
        }).orElseThrow(() -> new RuntimeException("Playlist not found with id: " + playlistId));
    }



    // Delete a playlist
    @Override
    public void deletePlaylist(String id) {
        playlistRepository.deleteById(id);
    }
}