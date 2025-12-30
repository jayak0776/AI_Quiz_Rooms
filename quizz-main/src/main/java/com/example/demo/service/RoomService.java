package com.example.demo.service;

import com.example.demo.dto.Room.RoomCreationRequest;
import com.example.demo.model.QuizRoom;
import com.example.demo.model.Users;
import com.example.demo.repository.QuizRoomRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RoomService {

    @Autowired
    QuizRoomRepository quizRoomRepository;

    @Autowired
    UserRepository userRepository;

    public ResponseEntity<?> createRoom(RoomCreationRequest request) {
        String roomCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        QuizRoom room = new QuizRoom();
        room.setRoomCode(roomCode);
        room.setActive(false);
        room.setStartTime(request.getStartTime());
        room.setExpirationTime(request.getExpirationTime());
        room.setMaxParticipants(request.getMaxParticipants());
        room.setCurrentParticipants(0);
        room.setCreatorId(request.getCreatorId());
        room.setCreatorName(request.getCreatorName());
        room.setTopic(request.getTopic());
        room.setDifficulty(request.getDifficulty());
        room.setQuestionCount(request.getQuestionCount());

        quizRoomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("roomCode", roomCode));
    }

    public ResponseEntity<String> joinRoom(String roomCode, Users user) {
        Optional<QuizRoom> roomOpt = quizRoomRepository.findById(roomCode);

        if (roomOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Room not found");
        }

        QuizRoom room = roomOpt.get();

        // Check expiration
        if (room.getExpirationTime() != null && LocalDateTime.now().isAfter(room.getExpirationTime())) {
            return ResponseEntity.status(400).body("Room expired");
        }

        // Check max participants
        if (room.getCurrentParticipants() >= room.getMaxParticipants()) {
            return ResponseEntity.status(400).body("Room full");
        }

        // Add participant
        String participantName = user.getFullName();
        if (!room.getParticipants().contains(participantName)) {
            room.getParticipants().add(participantName);
            room.setCurrentParticipants(room.getCurrentParticipants() + 1);
            quizRoomRepository.save(room);
        }

        return ResponseEntity.ok("Joined Room: " + roomCode);
    }

    public ResponseEntity<QuizRoom> getRoom(String roomCode) {
        Optional<QuizRoom> roomOpt = quizRoomRepository.findById(roomCode);
        if (roomOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(roomOpt.get());
    }


    public ResponseEntity<?> getAllRoomsByUser(Long userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<QuizRoom> rooms = quizRoomRepository.findAllByCreatorId(userId);

        return ResponseEntity.ok(Map.of("rooms", rooms));
    }

    public ResponseEntity<?> getAllRooms() {
        List<QuizRoom> rooms = quizRoomRepository.findAll();
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of("rooms",rooms));
    }
}
