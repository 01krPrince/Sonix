package music.example.music_app.service.impl;

import music.example.music_app.exception.ResourceNotFoundException;
import music.example.music_app.model.User;
import music.example.music_app.model.request.UserRequest;
import music.example.music_app.repository.UserRepository;
import music.example.music_app.service.PlaylistService;
import music.example.music_app.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PlaylistService playlistService;

    public UserServiceImpl(UserRepository userRepository, PlaylistService playlistService) {
        this.userRepository = userRepository;
        this.playlistService = playlistService;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(String id) {
        return Optional.ofNullable(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id)));
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username)));
    }

    @Override
    public User createUser(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        User newUser = new User();
        newUser.setUsername(userRequest.getUsername());
        newUser.setEmail(userRequest.getEmail());
        newUser.setPassword(userRequest.getPassword());

        User savedUser = userRepository.save(newUser);

        playlistService.initializeFav(savedUser.getId(), "Favorites");

        return savedUser;
    }

    @Override
    public User updateUser(String id, User userDetails) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (userDetails.getUsername() != null) {
                        existingUser.setUsername(userDetails.getUsername());
                    }
                    if (userDetails.getEmail() != null) {
                        existingUser.setEmail(userDetails.getEmail());
                    }
                    if (userDetails.getPassword() != null) {
                        existingUser.setPassword(userDetails.getPassword());
                    }
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User login(String email, String password) {
        User targetUser = userRepository.findByEmail(email);
        if (targetUser != null && targetUser.getPassword().equals(password)) {
            return targetUser;
        }
        throw new ResourceNotFoundException("Invalid email or password");
    }
}
