package com.roboxpressbd.config;

import com.roboxpressbd.entity.User;
import com.roboxpressbd.exception.ApiException;
import com.roboxpressbd.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    private final UserRepository userRepository;

    public CurrentUser(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ApiException("Authentication required");
        }
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));
    }
}
