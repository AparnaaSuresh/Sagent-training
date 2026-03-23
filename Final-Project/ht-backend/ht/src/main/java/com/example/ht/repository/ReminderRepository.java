package com.example.ht.repository;

import com.example.ht.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Integer> {
    List<Reminder> findByTaskTaskId(Integer taskId);
    List<Reminder> findByNotificationTime(LocalTime time);
}
