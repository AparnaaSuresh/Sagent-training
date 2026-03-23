package com.example.ht.controller;

import com.example.ht.entity.HabitLog;
import com.example.ht.service.HabitLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habit-logs")
public class HabitLogController {

    @Autowired
    private HabitLogService habitLogService;


    @PostMapping
    public ResponseEntity<?> logHabit(@RequestParam Integer taskId, @RequestBody HabitLog log) {
        try {
            return ResponseEntity.ok(habitLogService.logHabit(taskId, log));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/habit-logs?taskId=1  (logs for a specific task)
    @GetMapping
    public List<HabitLog> getLogsByTask(@RequestParam Integer taskId) {
        return habitLogService.getLogsByTask(taskId);
    }

    // GET /api/habit-logs/user/{userId}  (full history for a user)
    @GetMapping("/user/{userId}")
    public List<HabitLog> getLogsByUser(@PathVariable Integer userId) {
        return habitLogService.getLogsByUser(userId);
    }

    // GET /api/habit-logs/streak?taskId=1  (current streak count)
    @GetMapping("/streak")
    public ResponseEntity<?> getStreak(@RequestParam Integer taskId) {
        int streak = habitLogService.getStreak(taskId);
        return ResponseEntity.ok(Map.of("taskId", taskId, "streak", streak));
    }

    // DELETE /api/habit-logs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLog(@PathVariable Integer id) {
        habitLogService.deleteLog(id);
        return ResponseEntity.ok(Map.of("message", "Log deleted"));
    }
}
