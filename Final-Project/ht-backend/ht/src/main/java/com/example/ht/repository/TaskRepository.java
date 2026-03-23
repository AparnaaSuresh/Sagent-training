package com.example.ht.repository;

import com.example.ht.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByHabitHabitId(Integer habitId);
}
