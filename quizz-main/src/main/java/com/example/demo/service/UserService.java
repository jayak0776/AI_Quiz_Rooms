package com.example.demo.service;

import com.example.demo.dto.Auth.LoginDto;
import com.example.demo.dto.Auth.UserDto;
import com.example.demo.model.Users;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
            @Lazy
    AuthenticationManager authManager;

    @Autowired
    JWTService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;


    long tokenExpiration = 1800000;

    public String register(UserDto userDto) {


        if (userRepository.existsByEmail(userDto.getEmail())) {
            return "Email already registered";
        }


        Users u = new Users();
        u.setFullname(userDto.getFullName());
        u.setEmail(userDto.getEmail());


        u.setPassword(passwordEncoder.encode(userDto.getPassword()));

        userRepository.save(u);

        return "User registered successfully";
    }

    public String login(LoginDto user) {

        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            user.getPassword()
                    );

            Authentication authentication = authManager.authenticate(authToken);

            if (authentication.isAuthenticated()) {
                return jwtService.generateToken(
                        user.getEmail(),
                        tokenExpiration
                );
            }

            return "Login Failed";

        } catch (Exception e) {
            return "Login Failed: " + e.getMessage();
        }
    }



}
