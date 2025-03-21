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
    void deletePlaylist(String playlistId, String userId);
    Playlist addSongsInPlaylist(String id, String songId);

    void initializeFav(String id, String favorites);

    Playlist removeSongFromPlaylist(String playlistId, String songId);
}