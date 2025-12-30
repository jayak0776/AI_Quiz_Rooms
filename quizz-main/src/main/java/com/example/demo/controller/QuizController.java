package com.example.demo.controller;

import com.example.demo.dto.Room.QuizSubmissionDTO;
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
    @GetMapping("/{roomCode}/questions")
    public List<Questions> getQuestions(@PathVariable String roomCode) {
        return quizService.getQuestions(roomCode);
    }

    // Submit answer
    @PostMapping("/{roomCode}/submit")
    public ResponseEntity<?> submitQuiz(@PathVariable String roomCode, @RequestBody QuizSubmissionDTO submission) {
        quizService.submitQuiz(roomCode, submission);
        return ResponseEntity.ok().build(); // just return 200 OK
    }

    @GetMapping("/score/check/{roomCode}/user/{userId}")
    public ResponseEntity<?> checkSubmission(@PathVariable String roomCode, @PathVariable Long userId) {
        boolean submitted = quizService.hasUserSubmitted(userId, roomCode);
        return ResponseEntity.ok(Map.of("submitted", submitted));
    }

    @GetMapping("/scores/{userId}")
    public List<Score> scoreByUser(@PathVariable Long userId){
        return quizService.scoreByUser(userId);
    }

    // Get leaderboard
    @GetMapping("/leaderboard/{roomCode}")
    public List<Score> getLeaderboard(@PathVariable String roomCode) {
        return quizService.getLeaderboard(roomCode);
    }
}
