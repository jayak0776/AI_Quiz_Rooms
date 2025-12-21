package com.example.demo.repository;

import com.example.demo.model.QuizRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface QuizRoomRepository extends JpaRepository<QuizRoom, String> {}
