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

    @GetMapping
    public ResponseEntity<List<Playlist>> getAllPlaylists() {
        return ResponseEntity.ok(playlistService.getAllPlaylists());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylistById(@PathVariable String id) {
        return playlistService.getPlaylistById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Playlist>> getPlaylistsByUserId(@PathVariable String userId) {
        List<Playlist> playlists = playlistService.getPlaylistsByUserId(userId);
        if (playlists == null || playlists.isEmpty()) {
            // Return a 200 OK with an empty list instead of 404
            return ResponseEntity.ok(new ArrayList<Playlist>());
        }
        return ResponseEntity.ok(playlists);
    }

    @PostMapping
    public ResponseEntity<Playlist> createPlaylist(@RequestBody CreatePlaylistRequest createPlaylistRequest) {
        return ResponseEntity.ok(playlistService.createPlaylist(createPlaylistRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable String id) {
        playlistService.deletePlaylist(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{playlistId}/songs")
    public ResponseEntity<Playlist> addSongToPlaylist(
            @PathVariable String playlistId,
            @PathVariable String songId) {
        Playlist updatedPlaylist = playlistService.addSongsInPlaylist(playlistId, songId);
        return ResponseEntity.ok(updatedPlaylist);
    }

    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<Playlist> deleteSongFromPlaylist(
            @PathVariable String playlistId,
            @PathVariable String songId) {
        Playlist updatedPlaylist = playlistService.deleteSongFromPlaylist(playlistId, songId);
        return ResponseEntity.ok(updatedPlaylist);
    }
}
