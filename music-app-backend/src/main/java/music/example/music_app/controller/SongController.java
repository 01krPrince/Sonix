package music.example.music_app.controller;

import music.example.music_app.model.request.AddSongRequest;
import music.example.music_app.model.Song;
import music.example.music_app.service.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin("*")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    // Fetch all songs
    @GetMapping
    public ResponseEntity<List<Song>> getAllSongs() {
        return ResponseEntity.ok(songService.getAllSongs());
    }

    // Get song by ID
    @GetMapping("/{id}")
    public ResponseEntity<Song> getSongById(@PathVariable String id) {
        return songService.getSongById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new song
    @PostMapping
    public ResponseEntity<Song> createSong(@RequestBody AddSongRequest addSongRequest) {
        return ResponseEntity.ok(songService.createSong(addSongRequest));
    }

    // Update an existing song by ID
    @PutMapping("/{id}")
    public ResponseEntity<Song> updateSong(@PathVariable String id, @RequestBody Song song) {
        return ResponseEntity.ok(songService.updateSong(id, song));
    }

    // Delete song by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable String id) {
        songService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }

    // Get song by title
    @GetMapping("/title/{title}")
    public ResponseEntity<Song> getSongByTitle(@PathVariable String title) {
        return songService.getSongByTitle(title)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get songs by artist name
    @GetMapping("/artist/{artistName}")
    public ResponseEntity<List<Song>> getSongsByArtist(@PathVariable String artistName) {
        List<Song> songs = songService.getSongsByArtistName(artistName);
        return songs.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(songs);
    }

    // Get songs by album name
    @GetMapping("/album/{albumName}")
    public ResponseEntity<List<Song>> getSongsByAlbum(@PathVariable String albumName) {
        List<Song> songs = songService.getSongsByAlbumName(albumName);
        return songs.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(songs);
    }

    // Get songs by genre
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Song>> getSongsByGenre(@PathVariable String genre) {
        List<Song> songs = songService.getSongsByGenre(genre);
        return songs.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(songs);
    }
}