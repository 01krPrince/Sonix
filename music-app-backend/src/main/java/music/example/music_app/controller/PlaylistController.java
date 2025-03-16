package music.example.music_app.controller;

import music.example.music_app.model.Playlist;
import music.example.music_app.model.Song;  // Assuming you have a Song model
import music.example.music_app.model.request.CreatePlaylistRequest;
import music.example.music_app.service.PlaylistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin("*")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    // Get all playlists
    @GetMapping
    public ResponseEntity<List<Playlist>> getAllPlaylists() {
        return ResponseEntity.ok(playlistService.getAllPlaylists());
    }

    // Get playlist by ID
    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylistById(@PathVariable String id) {
        return playlistService.getPlaylistById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get playlists by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Playlist>> getPlaylistsByUserId(@PathVariable String userId) {
        List<Playlist> playlists = playlistService.getPlaylistsByUserId(userId);
        if (playlists == null || playlists.isEmpty()) {
            // Return a 200 OK with an empty list instead of 404
            return ResponseEntity.ok(new ArrayList<Playlist>());
        }
        return ResponseEntity.ok(playlists);
    }

    // Create a new playlist
    @PostMapping
    public ResponseEntity<Playlist> createPlaylist(@RequestBody CreatePlaylistRequest createPlaylistRequest) {
        return ResponseEntity.ok(playlistService.createPlaylist(createPlaylistRequest));
    }

    // Delete playlist by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable String id) {
        playlistService.deletePlaylist(id);
        return ResponseEntity.noContent().build();
    }

    // Add a song to a playlist
    @PutMapping("/{playlistId}/songs")
    public ResponseEntity<Playlist> addSongToPlaylist(
            @PathVariable String playlistId,
            @RequestBody Song song) {
        Playlist updatedPlaylist = playlistService.addSongsInPlaylist(playlistId, song);
        return ResponseEntity.ok(updatedPlaylist);
    }

    // Delete a song from a playlist
    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<Playlist> deleteSongFromPlaylist(
            @PathVariable String playlistId,
            @PathVariable String songId) {
        Playlist updatedPlaylist = playlistService.deleteSongFromPlaylist(playlistId, songId);
        return ResponseEntity.ok(updatedPlaylist);
    }
}
