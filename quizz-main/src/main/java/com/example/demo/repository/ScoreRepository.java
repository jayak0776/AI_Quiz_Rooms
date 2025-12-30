package com.example.demo.repository;

import com.example.demo.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByRoomCodeOrderByScoreDesc(String roomCode);
    Optional<Score> findByRoomCodeAndUserId(String roomCode, Long userId);

    boolean existsByUserIdAndRoomCode(Long userId, String roomCode);

    List<Score> findAllByUserId(Long userId);
}