package com.example.demo.dto.AI;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIQuestionDTO {
    private String question;
    private Map<String, String> options;
    private String correctAnswer;
}
