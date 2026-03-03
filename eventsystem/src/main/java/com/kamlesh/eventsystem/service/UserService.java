package com.kamlesh.eventsystem.service;

import com.kamlesh.eventsystem.dto.AdminDashboardStats;
import com.kamlesh.eventsystem.entity.User;
import com.kamlesh.eventsystem.model.Role;
import com.kamlesh.eventsystem.repository.BookingRepository;
import com.kamlesh.eventsystem.repository.EventRepository;
import com.kamlesh.eventsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    
    public User createUser(User user) {

    user.setPassword(passwordEncoder.encode(user.getPassword()));

    // Default role
    if (user.getRole() == null) {
        user.setRole(Role.USER);
    }

    return userRepository.save(user);
}

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

   
}