package com.kamlesh.eventsystem.service;

import com.kamlesh.eventsystem.dto.LoginRequest;
import com.kamlesh.eventsystem.dto.LoginResponse;
import com.kamlesh.eventsystem.dto.RegisterRequest;
import com.kamlesh.eventsystem.entity.User;
import com.kamlesh.eventsystem.model.Role;
import com.kamlesh.eventsystem.repository.UserRepository;
import com.kamlesh.eventsystem.security.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        
        return new LoginResponse(
            token,
            user.getEmail(),
            user.getName(),
            user.getRole().toString()
        );
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);
        
        String token = jwtUtil.generateToken(savedUser.getEmail());
        
        return new LoginResponse(
            token,
            savedUser.getEmail(),
            savedUser.getName(),
            savedUser.getRole().toString()
        );
    }
}
