package com.example.demo.controller;


import com.example.demo.dto.Auth.LoginDto;
import com.example.demo.dto.Auth.UserDto;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService us;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto user)
    {
        return us.register(user);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto user)
    {
        return us.login(user);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getDetails(@PathVariable Long userId){
        return us.getDetails(userId);
    }

    @GetMapping("/")
    public String greet(){
        return "Hello";
    }


};