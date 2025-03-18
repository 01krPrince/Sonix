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

    public void initializeFav(String userId, String fav) {
        if (playlistRepository.findByPlaylistName(fav) == null) {
            Playlist newPlaylist = new Playlist();
            newPlaylist.setUserId(userId);
            newPlaylist.setPlaylistName(fav);
            newPlaylist.setPlaylistSongs(new ArrayList<>());
            playlistRepository.save(newPlaylist);
        }
    }

    @Override
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    @Override
    public Optional<Playlist> getPlaylistById(String id) {
        return playlistRepository.findById(id);
    }

    @Override
    public List<Playlist> getPlaylistsByUserId(String userId) {
        return playlistRepository.findByUserId(userId);
    }

    @Override
    public Playlist createPlaylist(CreatePlaylistRequest createPlaylistRequest) {
        Playlist existingPlaylist = playlistRepository.findByPlaylistName(createPlaylistRequest.getPlaylistName().trim());

        if (existingPlaylist != null) {
            throw new RuntimeException("Playlist already exists with name: " + createPlaylistRequest.getPlaylistName());
        }

        Playlist newPlaylist = new Playlist();
        newPlaylist.setPlaylistName(createPlaylistRequest.getPlaylistName().trim());
        newPlaylist.setUserId(createPlaylistRequest.getUserId());
        newPlaylist.setPlaylistSongs(new ArrayList<>());

        return playlistRepository.save(newPlaylist);
    }

    @Override
    public Playlist addSongsInPlaylist(String id, Song song) {
        return playlistRepository.findById(id).map(existingPlaylist -> {
            List<Song> playlistSongs = existingPlaylist.getPlaylistSongs();
            if (playlistSongs == null) {
                playlistSongs = new ArrayList<>();
            }
            playlistSongs.add(song);
            existingPlaylist.setPlaylistSongs(playlistSongs);

            return playlistRepository.save(existingPlaylist);
        }).orElseThrow(() -> new RuntimeException("Playlist not found with id: " + id));
    }

    @Override
    public Playlist deleteSongFromPlaylist(String playlistId, String songId) {
        return playlistRepository.findById(playlistId).map(existingPlaylist -> {
            List<Song> playlistSongs = existingPlaylist.getPlaylistSongs();
            if (playlistSongs != null) {
                playlistSongs.removeIf(song -> song.getId().equals(songId));
            }
            existingPlaylist.setPlaylistSongs(playlistSongs);
            return playlistRepository.save(existingPlaylist);
        }).orElseThrow(() -> new RuntimeException("Playlist not found with id: " + playlistId));
    }

    @Override
    public void deletePlaylist(String id) {
        playlistRepository.deleteById(id);
    }
}
