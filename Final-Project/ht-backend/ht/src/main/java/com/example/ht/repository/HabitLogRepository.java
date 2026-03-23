package com.example.ht.repository;

import com.example.ht.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface HabitLogRepository extends JpaRepository<HabitLog, Integer> {
    List<HabitLog> findByTaskTaskId(Integer taskId);
    List<HabitLog> findByTaskTaskIdOrderByDateDesc(Integer taskId);
    List<HabitLog> findByTaskHabitUserUserIdOrderByDateDesc(Integer userId);
    long countByTaskTaskIdAndStatus(Integer taskId, HabitLog.Status status);
}
