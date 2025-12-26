package com.example.demo.service;

import com.example.demo.model.Questions;
import com.example.demo.model.Score;
import com.example.demo.repository.QuestionsRepository;
import com.example.demo.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class QuizService {

    @Autowired
    QuestionsRepository questionsRepository;

    @Autowired
    ScoreRepository scoreRepository;

    public ResponseEntity<String> addQuestion(Questions question) {
        questionsRepository.save(question);
        return ResponseEntity.ok("Question added");
    }

    // Get questions for a room
    public List<Questions> getQuestions(String roomCode) {
        return questionsRepository.findByRoomCode(roomCode);
    }

    // Submit answer
    public ResponseEntity<String> submitAnswer(Map<String, String> payload) {
        Long userId = Long.parseLong(payload.get("userId"));
        String userName = payload.get("userName");
        String roomCode = payload.get("roomCode");
        Long questionId = Long.parseLong(payload.get("questionId"));
        String answer = payload.get("answer");

        Questions question = questionsRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        int scoreToAdd = question.getCorrectAnswer().equalsIgnoreCase(answer) ? 1 : 0;

        Score score = scoreRepository.findByRoomCodeAndUserId(roomCode, userId)
                .orElse(new Score(null, userId, userName, roomCode, 0));

        score.setScore(score.getScore() + scoreToAdd);
        scoreRepository.save(score);

        return ResponseEntity.ok("Answer submitted");
    }

    // Get leaderboard
    public List<Score> getLeaderboard(String roomCode) {
        return scoreRepository.findByRoomCodeOrderByScoreDesc(roomCode);
    }
}
