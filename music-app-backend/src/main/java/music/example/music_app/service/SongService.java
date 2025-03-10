package music.example.music_app.service;

import music.example.music_app.model.AddSongRequest;
import music.example.music_app.model.Song;

import java.util.List;
import java.util.Optional;

public interface SongService {
    List<Song> getAllSongs();
    Optional<Song> getSongById(Long id);
    Optional<Song> getSongByTitle(String title);
    Song createSong(AddSongRequest addSongRequest);
    Song updateSong(Long id, Song song);
    void deleteSong(Long id);
    boolean existsByTitle(String title);

    List<Song> getSongsByArtistName(String artistName);

    List<Song> getSongsByAlbumName(String albumName);

    List<Song> getSongsByGenre(String genre);
}
