package com.example.demo.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizRoom {

    @Id
    private String roomCode;

    private boolean active;

    private LocalDateTime startTime;
    private LocalDateTime expirationTime;

    private int maxParticipants;
    private int currentParticipants;

    private Long creatorId;       // ID of user who created room
    private String creatorName;   // Name of creator

    @ElementCollection
    private List<String> participants = new ArrayList<>();  // List of joined user names
}

