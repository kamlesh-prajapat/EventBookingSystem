package com.kamlesh.eventsystem.controller;

import com.kamlesh.eventsystem.entity.User;
import com.kamlesh.eventsystem.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

   @PostMapping
public User createUser(@Valid @RequestBody User user) {
    return userService.createUser(user);
}

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @GetMapping("/test")
public String test() {
    return "JWT Working Successfully 🚀";
}
}