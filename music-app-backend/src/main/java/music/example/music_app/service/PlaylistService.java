package music.example.music_app.service;

import music.example.music_app.model.Playlist;
import music.example.music_app.model.request.CreatePlaylistRequest;

import java.util.List;
import java.util.Optional;

public interface PlaylistService {
    List<Playlist> getAllPlaylists();
    Optional<Playlist> getPlaylistById(String id);
    List<Playlist> getPlaylistsByUserId(String userId);
    Playlist createPlaylist(CreatePlaylistRequest createPlaylistRequest);
    Playlist updatePlaylist(String id, Playlist playlist);
    void deletePlaylist(String id);
}
