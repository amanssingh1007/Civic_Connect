
package com.ccl.civicconnect.service;

import com.ccl.civicconnect.dto.AdminLoginRequest;
import com.ccl.civicconnect.dto.LoginRequest;
import com.ccl.civicconnect.dto.RegisterRequest;
import com.ccl.civicconnect.entity.User;
import com.ccl.civicconnect.repository.UserRepository;
import com.ccl.civicconnect.security.Role;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerCitizen(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists");
        }

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CITIZEN);

        return userRepository.save(user);
    }

    public User loginCitizen(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (user.getRole() != Role.CITIZEN) {
            throw new IllegalArgumentException("This login is for citizens only");
        }

        return user;
    }

    public User loginAdmin(AdminLoginRequest request) {
        User user = userRepository.findByEmail(
                request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid admin credentials"));

        if (user.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        return user;
    }

}
