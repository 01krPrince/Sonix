package music.example.music_app.repository;

import music.example.music_app.model.Song;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SongRepository extends MongoRepository<Song, Long> {
    Optional<Song> findByTitle(String title);
    boolean existsByTitle(String title);
    List<Song> findByArtistName(String artistName);
    List<Song> findByAlbumName(String albumName);
    List<Song> findByGenre(String genre);
}