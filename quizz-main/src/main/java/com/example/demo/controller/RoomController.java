package com.example.demo.controller;

import com.example.demo.dto.Room.RoomCreationRequest;
import com.example.demo.model.QuizRoom;
import com.example.demo.model.Users;
import com.example.demo.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/room/")
public class RoomController {

    @Autowired
    RoomService roomService;

    @PostMapping("/create")
    public ResponseEntity<String> createRoom(@RequestBody RoomCreationRequest request) {
        return roomService.createRoom(request);
    }

    @PostMapping("/join/{roomCode}")
    public ResponseEntity<String> joinRoom(@PathVariable String roomCode, @RequestBody Users user) {
        return roomService.joinRoom(roomCode,user);
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<QuizRoom> getRoom(@PathVariable String roomCode) {
        return roomService.getRoom(roomCode);
    }



}
