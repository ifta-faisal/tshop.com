package com.roboxpressbd.controller;

import com.roboxpressbd.entity.User;
import com.roboxpressbd.exception.ApiException;
import com.roboxpressbd.config.CurrentUser;
import com.roboxpressbd.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/account")
public class AccountController {

    private final CurrentUser currentUser;
    private final UserRepository userRepository;

    public AccountController(CurrentUser currentUser, UserRepository userRepository) {
        this.currentUser = currentUser;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public User me() {
        return currentUser.get();
    }

    @PutMapping("/me")
    public User update(@RequestBody Map<String, String> body) {
        User me = currentUser.get();
        if (body.containsKey("fullName")) me.setFullName(body.get("fullName"));
        if (body.containsKey("phone")) me.setPhone(body.get("phone"));
        if (body.containsKey("address")) me.setAddress(body.get("address"));
        if (me.getFullName() == null || me.getFullName().isBlank()) throw new ApiException("Name required");
        return userRepository.save(me);
    }
}
