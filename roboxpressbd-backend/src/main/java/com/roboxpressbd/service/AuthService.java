package com.roboxpressbd.service;

import com.roboxpressbd.dto.AuthDtos;
import com.roboxpressbd.entity.User;
import com.roboxpressbd.exception.ApiException;
import com.roboxpressbd.repository.UserRepository;
import com.roboxpressbd.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthDtos.AuthResponse signup(AuthDtos.SignupRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ApiException("Email already registered");
        }
        User user = User.builder()
                .fullName(req.fullName())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .phone(req.phone())
                .roles(Set.of("ROLE_USER"))
                .build();
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRoles());
        return new AuthDtos.AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRoles());
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ApiException("Invalid email or password"));
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new ApiException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRoles());
        return new AuthDtos.AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRoles());
    }
}
