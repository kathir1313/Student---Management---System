package com.kathiravan.student_management_system.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kathiravan.student_management_system.dto.LoginRequest;
import com.kathiravan.student_management_system.dto.RegisterRequest;
import com.kathiravan.student_management_system.entity.User;
import com.kathiravan.student_management_system.repository.UserRepository;
import com.kathiravan.student_management_system.dto.LoginResponse;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder,
                   JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}
public String register(RegisterRequest request) {

    System.out.println("Register API Called");
    System.out.println("Username = " + request.getUsername());

    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
        return "Username already exists";
    }

    User user = new User();
    user.setUsername(request.getUsername());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole());

    User savedUser = userRepository.save(user);

    System.out.println("Saved User ID = " + savedUser.getId());

    return "User Registered Successfully";
}
}