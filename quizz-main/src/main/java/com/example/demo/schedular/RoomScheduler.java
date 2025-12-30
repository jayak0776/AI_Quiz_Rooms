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

            if (room.getStartTime() != null && room.getExpirationTime() != null) {

                // ACTIVE window
                if (now.isAfter(room.getStartTime()) && now.isBefore(room.getExpirationTime())) {
                    if (!room.isActive()) {
                        room.setActive(true);
                        quizRoomRepository.save(room);
                    }
                }
                // ENDED
                else if (now.isAfter(room.getExpirationTime())) {
                    if (room.isActive()) {
                        room.setActive(false);
                        quizRoomRepository.save(room);
                    }
                }
            }
        }
    }

}

