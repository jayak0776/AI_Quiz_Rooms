package com.example.demo.service;

import com.example.demo.dto.Room.RoomCreationRequest;
import com.example.demo.model.QuizRoom;
import com.example.demo.model.Users;
import com.example.demo.repository.QuizRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RoomService {

    @Autowired
    QuizRoomRepository quizRoomRepository;

    public ResponseEntity<String> createRoom(RoomCreationRequest request) {
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

        quizRoomRepository.save(room);
        return ResponseEntity.ok(roomCode);
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
        String participantName = user.getFullName() + "(" + user.getId() + ")";
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



}
