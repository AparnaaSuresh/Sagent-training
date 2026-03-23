package com.example.ht.controller;

import com.example.ht.entity.Task;
import com.example.ht.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // POST /api/tasks?habitId=1
    @PostMapping
    public ResponseEntity<?> createTask(@RequestParam Integer habitId, @RequestBody Task task) {
        try {
            return ResponseEntity.ok(taskService.createTask(habitId, task));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/tasks?habitId=1
    @GetMapping
    public List<Task> getTasksByHabit(@RequestParam Integer habitId) {
        return taskService.getTasksByHabit(habitId);
    }

    // GET /api/tasks/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(taskService.getTaskById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/tasks/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Integer id, @RequestBody Task task) {
        try {
            return ResponseEntity.ok(taskService.updateTask(id, task));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PATCH /api/tasks/{id}/done  — mark task as done
    @PatchMapping("/{id}/done")
    public ResponseEntity<?> markAsDone(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(taskService.markAsDone(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/tasks/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(Map.of("message", "Task deleted"));
    }
}
