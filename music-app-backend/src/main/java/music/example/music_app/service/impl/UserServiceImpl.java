package music.example.music_app.service.impl;

import music.example.music_app.exception.ResourceNotFoundException;
import music.example.music_app.model.User;
import music.example.music_app.model.request.UserRequest;
import music.example.music_app.repository.UserRepository;
import music.example.music_app.service.UserService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(String id) {
        return Optional.ofNullable(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserRequest not found with id: " + id)));
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("UserRequest not found with username: " + username)));
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

        newUser.setPlaylist(new ArrayList<>());

        return userRepository.save(newUser);
    }


    @Override
    public User updateUser(String id, User userDetails) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setUsername(userDetails.getUsername());
                    existingUser.setEmail(userDetails.getEmail());
                    existingUser.setPassword(userDetails.getPassword());
                    existingUser.setPlaylist(userDetails.getPlaylist());
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new ResourceNotFoundException("UserRequest not found with id: " + id));
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("UserRequest not found with id: " + id);
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
        if(targetUser.getPassword().equals(password)){
            return targetUser;
        }
        return new User();
    }
}