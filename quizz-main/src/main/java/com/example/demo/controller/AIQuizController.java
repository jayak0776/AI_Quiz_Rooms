package com.example.demo.controller;

import com.example.demo.dto.AI.AIQuizRequest;
import com.example.demo.model.Questions;
import com.example.demo.repository.QuestionsRepository;
import com.example.demo.service.AIQuizService;
import org.aspectj.weaver.patterns.TypePatternQuestions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AIQuizController {
    @Autowired
    private AIQuizService aiQuizService;

    @Autowired
    private QuestionsRepository questionRepository;

    @PostMapping("/generate")
    public ResponseEntity<String> generateQuiz(
            @RequestBody AIQuizRequest request) {

        List<Questions> questions = aiQuizService.generateQuiz(request);
        questionRepository.saveAll(questions);

        return ResponseEntity.ok("AI quiz generated successfully");
    }
}
