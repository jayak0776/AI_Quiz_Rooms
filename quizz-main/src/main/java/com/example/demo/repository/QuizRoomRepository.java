package com.example.demo.repository;

import com.example.demo.model.QuizRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface QuizRoomRepository extends JpaRepository<QuizRoom, String> {

    List<QuizRoom> findAllByCreatorId(Long userId);

    QuizRoom findByRoomCode(String roomCode);
}
