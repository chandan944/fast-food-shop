package Baito.user.Serive;

import Baito.user.Repository.UserRepository;
import Baito.user.dto.UserRequest;
import Baito.user.dto.UserResponse;
import Baito.user.user.User;
import Baito.user.utils.Encoder;
import Baito.user.utils.JsonWebToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;






@Service
public class UserService {

    private final UserRepository userRepository;
    private final Encoder encoder;
    private final JsonWebToken jsonWebToken;

    public UserService(UserRepository userRepository, Encoder encoder, JsonWebToken jsonWebToken) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jsonWebToken = jsonWebToken;
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    public UserResponse login(UserRequest userRequest) {
        User user = userRepository.findByEmail(userRequest.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!encoder.matches(userRequest.password(), user.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect.");
        }

        String token = jsonWebToken.generateToken(userRequest.email());
        return new UserResponse(token, "Authentication succeeded.");
    }

    public UserResponse signIn(UserRequest userRequest) {

        User user = new User(
                userRequest.name(),
                userRequest.address(),
                userRequest.contact(),
                userRequest.email(),
                encoder.encode(userRequest.password())
        );

        userRepository.save(user);

        String authToken = jsonWebToken.generateToken(userRequest.email());

        return new UserResponse(authToken, "User registered successfully 🎉");
    }


}
