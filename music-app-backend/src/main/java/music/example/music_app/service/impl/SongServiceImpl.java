package music.example.music_app.service.impl;

import music.example.music_app.exception.ResourceNotFoundException;
import music.example.music_app.model.AddSongRequest;
import music.example.music_app.model.Song;
import music.example.music_app.repository.SongRepository;
import music.example.music_app.service.SongService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SongServiceImpl implements SongService {

    private final SongRepository songRepository;

    public SongServiceImpl(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @Override
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    @Override
    public Optional<Song> getSongById(Long id) {
        return Optional.ofNullable(songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id)));
    }

    @Override
    public Optional<Song> getSongByTitle(String title) {
        return Optional.ofNullable(songRepository.findByTitle(title)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with title: " + title)));
    }

    @Override
    public Song createSong(AddSongRequest addSongRequest) {
        if (songRepository.existsByTitle(addSongRequest.getTitle())) {
            throw new IllegalArgumentException("Song with this title already exists.");
        }
        Song newSong = new Song();
        newSong.setTitle(addSongRequest.getTitle());
        newSong.setArtistName(addSongRequest.getArtistName());
        newSong.setSongUrl(addSongRequest.getSongUrl());
        newSong.setGenre(addSongRequest.getGenre());
        newSong.setAlbumName(addSongRequest.getAlbumName());
        newSong.setPreviewImg(addSongRequest.getPreviewImg());
        return songRepository.save(newSong);
    }

    @Override
    public Song updateSong(Long id, Song songDetails) {
        return songRepository.findById(id)
                .map(existingSong -> {
                    existingSong.setTitle(songDetails.getTitle());
                    existingSong.setArtistName(songDetails.getArtistName());
                    existingSong.setAlbumName(songDetails.getAlbumName());
                    existingSong.setGenre(songDetails.getGenre());
                    existingSong.setSongUrl(songDetails.getSongUrl());
                    return songRepository.save(existingSong);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }

    @Override
    public void deleteSong(Long id) {
        if (!songRepository.existsById(id)) {
            throw new ResourceNotFoundException("Song not found with id: " + id);
        }
        songRepository.deleteById(id);
    }

    @Override
    public boolean existsByTitle(String title) {
        return songRepository.existsByTitle(title);
    }

    @Override
    public List<Song> getSongsByArtistName(String artistName) {
        List<Song> songs = songRepository.findByArtistName(artistName);
        if (songs.isEmpty()) {
            throw new ResourceNotFoundException("No songs found by artist: " + artistName);
        }
        return songs;
    }

    @Override
    public List<Song> getSongsByAlbumName(String albumName) {
        List<Song> songs = songRepository.findByAlbumName(albumName);
        if (songs.isEmpty()) {
            throw new ResourceNotFoundException("No songs found in album: " + albumName);
        }
        return songs;
    }

    @Override
    public List<Song> getSongsByGenre(String genre) {
        List<Song> songs = songRepository.findByGenre(genre);
        if (songs.isEmpty()) {
            throw new ResourceNotFoundException("No songs found in genre: " + genre);
        }
        return songs;
    }
}
