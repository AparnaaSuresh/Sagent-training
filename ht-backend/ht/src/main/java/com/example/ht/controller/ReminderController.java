package com.example.ht.controller;

import com.example.ht.entity.Reminder;
import com.example.ht.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    // POST /api/reminders?taskId=1
    @PostMapping
    public ResponseEntity<?> createReminder(@RequestParam Integer taskId, @RequestBody Reminder reminder) {
        try {
            return ResponseEntity.ok(reminderService.createReminder(taskId, reminder));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/reminders?taskId=1
    @GetMapping
    public List<Reminder> getRemindersByTask(@RequestParam Integer taskId) {
        return reminderService.getRemindersByTask(taskId);
    }

    // GET /api/reminders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getReminderById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(reminderService.getReminderById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/reminders/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReminder(@PathVariable Integer id, @RequestBody Reminder reminder) {
        try {
            return ResponseEntity.ok(reminderService.updateReminder(id, reminder));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/reminders/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(@PathVariable Integer id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.ok(Map.of("message", "Reminder deleted"));
    }
}
