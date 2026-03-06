package com.kamlesh.eventsystem.controller;

import com.kamlesh.eventsystem.dto.LoginRequest;
import com.kamlesh.eventsystem.dto.LoginResponse;
import com.kamlesh.eventsystem.dto.RegisterRequest;
import com.kamlesh.eventsystem.service.AuthService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public LoginResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}