package music.example.music_app.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "playlist")
public class Playlist {
    @Id
    private String id;
    private String userId;
    private String playlistName;
    private List<Song> playlistSongs;
}
