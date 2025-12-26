package com.example.demo.service;

import com.example.demo.dto.AI.AIQuestionDTO;
import com.example.demo.dto.AI.AIQuizRequest;
import com.example.demo.model.Questions;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AIQuizService {

    @Value("${gemini.api.key}")
    private String apiKey;

    // ---------------- GENERATE QUIZ ----------------
    // ---------------- GENERATE QUIZ ----------------
    public List<Questions> generateQuiz(AIQuizRequest request) {
        String promptText = buildPrompt(request.getTopic(), request.getDifficulty(), request.getQuestionCount());

        Client client = Client.builder()
                .apiKey(apiKey)
                .httpOptions(com.google.genai.types.HttpOptions.builder()
                        .apiVersion("v1")
                        .build())
                .build();

        try {
            // Try the 'lite' model which is more available on the free tier
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash-lite", // Changed from 2.0-flash
                    promptText,
                    GenerateContentConfig.builder()
                            .temperature(0.7F)
                            .build()
            );

            return parseAndConvert(response.text(), request.getRoomCode());

        } catch (com.google.genai.errors.ClientException e) {
            if (e.getMessage().contains("429")) {
                throw new RuntimeException("The Free Tier is currently overloaded. Please wait 60 seconds or link a billing account in AI Studio.");
            }
            throw e;
        }
    }
    // ---------------- BUILD PROMPT ----------------
    private String buildPrompt(String topic, String difficulty, int count) {
        return """
            Output ONLY valid JSON. Do not include markdown formatting or backticks.
            Generate a JSON array of %d MCQs for topic "%s".
            
            Format:
            [
              {
                "question": "...",
                "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
                "correctAnswer": "A"
              }
            ]
            """.formatted(count, topic);
    }

    // ---------------- PARSE AI RESPONSE ----------------
    private List<Questions> parseAndConvert(String jsonResponse, String roomCode) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // Strip any markdown code blocks if the API happens to include them
            String cleanedJson = jsonResponse.replaceAll("```json|```", "").trim();

            List<AIQuestionDTO> aiQuestions = mapper.readValue(cleanedJson, new TypeReference<>() {});
            List<Questions> questions = new ArrayList<>();

            for (AIQuestionDTO dto : aiQuestions) {
                Questions q = new Questions();
                q.setRoomCode(roomCode);
                q.setQuestionText(dto.getQuestion());
                q.setOptions(dto.getOptions());
                q.setCorrectAnswer(dto.getCorrectAnswer());
                questions.add(q);
            }
            return questions;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response: " + jsonResponse, e);
        }
    }
}