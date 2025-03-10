package music.example.music_app.service.impl;

import music.example.music_app.model.Playlist;
import music.example.music_app.repository.PlaylistRepository;
import music.example.music_app.service.PlaylistService;
import org.springframework.stereotype.Service;

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
    public Playlist createPlaylist(Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    // Update existing playlist
    @Override
    public Playlist updatePlaylist(String id, Playlist playlist) {
        return playlistRepository.findById(id).map(existingPlaylist -> {
            existingPlaylist.setPlaylistName(playlist.getPlaylistName());
            return playlistRepository.save(existingPlaylist);
        }).orElseThrow(() -> new RuntimeException("Playlist not found with id: " + id));
    }

    // Delete a playlist
    @Override
    public void deletePlaylist(String id) {
        playlistRepository.deleteById(id);
    }
}
