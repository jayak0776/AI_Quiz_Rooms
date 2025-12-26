package com.example.demo.schedular;

import com.example.demo.model.QuizRoom;
import com.example.demo.repository.QuizRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class RoomScheduler {

    @Autowired
    private QuizRoomRepository quizRoomRepository;

    @Scheduled(fixedRate = 60000) // every 1 minute
    public void updateRoomStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<QuizRoom> rooms = quizRoomRepository.findAll();

        for (QuizRoom room : rooms) {
            // Start scheduled room
            if (!room.isActive() && room.getStartTime() != null && now.isAfter(room.getStartTime())) {
                room.setActive(true);
                quizRoomRepository.save(room);
            }

            // Expire room
            if (room.getExpirationTime() != null && now.isAfter(room.getExpirationTime())) {
                room.setActive(false);
                quizRoomRepository.save(room);
            }
        }
    }
}

