package com.example.ht.service;

import com.example.ht.entity.HabitLog;
import com.example.ht.entity.Task;
import com.example.ht.repository.HabitLogRepository;
import com.example.ht.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HabitLogService {

    @Autowired
    private HabitLogRepository habitLogRepository;

    @Autowired
    private TaskRepository taskRepository;

    public HabitLog logHabit(Integer taskId, HabitLog log) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        log.setTask(task);
        if (log.getDate() == null) {
            log.setDate(LocalDate.now());
        }
        return habitLogRepository.save(log);
    }

    public List<HabitLog> getLogsByTask(Integer taskId) {
        return habitLogRepository.findByTaskTaskIdOrderByDateDesc(taskId);
    }

    public List<HabitLog> getLogsByUser(Integer userId) {
        return habitLogRepository.findByTaskHabitUserUserIdOrderByDateDesc(userId);
    }
    public int getStreak(Integer taskId) {
        List<HabitLog> logs = habitLogRepository.findByTaskTaskIdOrderByDateDesc(taskId);
        int streak = 0;
        LocalDate expected = LocalDate.now();

        for (HabitLog log : logs) {
            if (log.getStatus() == HabitLog.Status.completed && log.getDate().equals(expected)) {
                streak++;
                expected = expected.minusDays(1);
            } else {
                break;
            }
        }
        return streak;
    }

    public HabitLog getLogById(Integer id) {
        return habitLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found with id: " + id));
    }

    public void deleteLog(Integer id) {
        habitLogRepository.deleteById(id);
    }
}
