package com.example.ht.controller;

import com.example.ht.entity.Habit;
import com.example.ht.service.HabitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    @Autowired
    private HabitService habitService;

    // POST /api/habits?userId=1
    @PostMapping
    public ResponseEntity<?> createHabit(@RequestParam Integer userId, @RequestBody Habit habit) {
        try {
            return ResponseEntity.ok(habitService.createHabit(userId, habit));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping
    public List<Habit> getHabitsByUser(@RequestParam Integer userId) {
        return habitService.getHabitsByUser(userId);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getHabitById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(habitService.getHabitById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateHabit(@PathVariable Integer id, @RequestBody Habit habit) {
        try {
            return ResponseEntity.ok(habitService.updateHabit(id, habit));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHabit(@PathVariable Integer id) {
        habitService.deleteHabit(id);
        return ResponseEntity.ok(Map.of("message", "Habit deleted"));
    }
}
