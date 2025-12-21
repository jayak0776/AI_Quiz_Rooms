package com.example.demo.dto.AI;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIQuizRequest {
    private String topic;
    private String difficulty;   // Easy / Medium / Hard
    private int questionCount;
    private String roomCode;
}
