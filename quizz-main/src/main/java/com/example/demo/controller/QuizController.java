package com.example.demo.controller;

import com.example.demo.model.Questions;
import com.example.demo.model.Score;
import com.example.demo.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    QuizService quizService;

    @PostMapping("/add-question")
    public ResponseEntity<String> addQuestion(@RequestBody Questions question) {
        return quizService.addQuestion(question);
    }

    // Get questions for a room
    @GetMapping("/questions/{roomCode}")
    public List<Questions> getQuestions(@PathVariable String roomCode) {
        return quizService.getQuestions(roomCode);
    }

    // Submit answer
    @PostMapping("/submit-answer")
    public ResponseEntity<String> submitAnswer(@RequestBody Map<String, String> payload) {
        return quizService.submitAnswer(payload);
    }

    // Get leaderboard
    @GetMapping("/leaderboard/{roomCode}")
    public List<Score> getLeaderboard(@PathVariable String roomCode) {
        return quizService.getLeaderboard(roomCode);
    }
}
