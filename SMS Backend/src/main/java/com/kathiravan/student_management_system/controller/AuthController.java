package com.kathiravan.student_management_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kathiravan.student_management_system.dto.LoginRequest;
import com.kathiravan.student_management_system.dto.RegisterRequest;
import com.kathiravan.student_management_system.service.AuthService;
import com.kathiravan.student_management_system.dto.LoginResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                authService.register(request));
    }

    @PostMapping("/login")
public ResponseEntity<LoginResponse> login(
        @RequestBody LoginRequest request) {

    return ResponseEntity.ok(
            authService.login(request));
}
}