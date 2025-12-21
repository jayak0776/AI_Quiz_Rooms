package com.example.demo.service;

import com.example.demo.dto.Auth.LoginDto;
import com.example.demo.dto.Auth.LoginResponse;
import com.example.demo.dto.Auth.UserDto;
import com.example.demo.model.Users;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

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

    public ResponseEntity<?> register(UserDto userDto) {


        if (userRepository.existsByEmail(userDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("Message","User Already Exists"));
        }


        Users u = new Users();
        u.setFullName(userDto.getFullName());
        u.setEmail(userDto.getEmail());


        u.setPassword(passwordEncoder.encode(userDto.getPassword()));

        userRepository.save(u);

        return ResponseEntity.status(HttpStatus.OK)
                .body(Map.of("Message","User Created Successfully"));
    }

    public ResponseEntity<?> login(LoginDto user) {

        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            user.getPassword()
                    );

            Authentication authentication = authManager.authenticate(authToken);

            String token =jwtService.generateToken(user.getEmail(),tokenExpiration);

            if (authentication.isAuthenticated()) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(new LoginResponse(token));
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("Message","Login Failed"));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("Message",e.getMessage()));
        }
    }



}
