package com.example.demo.dto.Room;

import lombok.Data;

import java.util.Map;

@Data
public class QuizSubmissionDTO {
    private Long userId;
    private String userFullName;
    private Map<Long, String> answers; // Map<QuestionId, SelectedOptionKey>
}