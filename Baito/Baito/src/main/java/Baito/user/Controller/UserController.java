package Baito.user.Controller;

import Baito.user.Serive.UserService;
import Baito.user.dto.UserRequest;
import Baito.user.dto.UserResponse;
import Baito.user.user.User;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/authentication")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody UserRequest userRequest){
        return userService.login(userRequest);
    }

    @PostMapping("/signin")
    public UserResponse signIn(@Valid @RequestBody UserRequest userRequest){
        return userService.signIn(userRequest);
    }

    @GetMapping("/users/me")
    public User getUser(@RequestAttribute("authenticatedUser") User user) {
        return user;
    }

}
