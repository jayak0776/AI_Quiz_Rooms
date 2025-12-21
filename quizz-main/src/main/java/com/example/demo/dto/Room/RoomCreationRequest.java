package com.example.demo.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomCreationRequest {
    private LocalDateTime startTime;
    private LocalDateTime expirationTime;
    private int maxParticipants;
    private Long creatorId;
    private String creatorName;
}
