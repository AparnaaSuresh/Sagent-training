package com.example.ht.service;

import com.example.ht.entity.Habit;
import com.example.ht.entity.Task;
import com.example.ht.repository.HabitRepository;
import com.example.ht.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private HabitRepository habitRepository;

    public Task createTask(Integer habitId, Task task) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
        task.setHabit(habit);
        return taskRepository.save(task);
    }

    public List<Task> getTasksByHabit(Integer habitId) {
        return taskRepository.findByHabitHabitId(habitId);
    }

    public Task getTaskById(Integer id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    public Task updateTask(Integer id, Task updated) {
        Task existing = getTaskById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setDueDate(updated.getDueDate());
        existing.setStatus(updated.getStatus());
        return taskRepository.save(existing);
    }

    public Task markAsDone(Integer id) {
        Task task = getTaskById(id);
        task.setStatus(Task.Status.done);
        return taskRepository.save(task);
    }

    public void deleteTask(Integer id) {
        taskRepository.deleteById(id);
    }
}