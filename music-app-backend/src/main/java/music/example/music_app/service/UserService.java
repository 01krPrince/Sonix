package music.example.music_app.service;

import music.example.music_app.model.User;
import music.example.music_app.model.request.UserRequest;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(String id);
    Optional<User> getUserByUsername(String username);
    User createUser(UserRequest userRequest);
    User updateUser(String id, User user);
    void deleteUser(String id);
    boolean existsByEmail(String email);
}
