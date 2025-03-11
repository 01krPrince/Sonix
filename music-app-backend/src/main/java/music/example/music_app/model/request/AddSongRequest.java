package music.example.music_app.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "song")
public class AddSongRequest {
    private String title;
    private String artistName;
    private String albumName;
    private String genre; // "Rock", "Pop", "Hip-Hop"
    private String songUrl;
    private String previewImg;
}
