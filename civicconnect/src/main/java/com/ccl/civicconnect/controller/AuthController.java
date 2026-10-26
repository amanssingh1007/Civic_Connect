
package com.ccl.civicconnect.controller;

import com.ccl.civicconnect.dto.AdminLoginRequest;
import com.ccl.civicconnect.dto.LoginRequest;
import com.ccl.civicconnect.dto.RegisterRequest;
import com.ccl.civicconnect.entity.User;
import com.ccl.civicconnect.security.JwtService;
import com.ccl.civicconnect.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        try {
            User user = userService.registerCitizen(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Citizen registered successfully",
                            "id", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", user.getRole().name()));

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.loginCitizen(request);

            String token = jwtService.generateToken(
                    user.getEmail(),
                    user.getRole().name());

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Login successful",
                            "token", token,
                            "id", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", user.getRole().name()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(
            @Valid @RequestBody AdminLoginRequest request) {

        try {
            User user = userService.loginAdmin(request);

            String token = jwtService.generateToken(
                    user.getEmail(),
                    user.getRole().name());

            return ResponseEntity.ok(Map.of(
                    "message", "Admin login successful",
                    "token", token,
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole().name()));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", "Invalid admin credentials"));
        }
    }

}