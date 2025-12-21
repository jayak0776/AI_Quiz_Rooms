package com.example.demo.controller;


import com.example.demo.dto.Auth.LoginDto;
import com.example.demo.dto.Auth.UserDto;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService us;

    @PostMapping("/register")
    public String register(@RequestBody UserDto user)
    {
        return us.register(user);
    }


    @PostMapping("/login")
    public String login(@RequestBody LoginDto user)
    {
        return us.login(user);
    }

    @GetMapping("/")
    public String greet(){
        return "Hello";
    }


}
