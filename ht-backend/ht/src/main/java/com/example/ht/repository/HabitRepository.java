package com.example.ht.repository;

import com.example.ht.entity.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitRepository extends JpaRepository<Habit, Integer> {
    List<Habit> findByUserUserId(Integer userId);
}
