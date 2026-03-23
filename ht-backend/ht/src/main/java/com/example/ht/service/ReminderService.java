package com.example.ht.service;

import com.example.ht.entity.Reminder;
import com.example.ht.entity.Task;
import com.example.ht.repository.ReminderRepository;
import com.example.ht.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private TaskRepository taskRepository;

    public Reminder createReminder(Integer taskId, Reminder reminder) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        reminder.setTask(task);
        return reminderRepository.save(reminder);
    }

    public List<Reminder> getRemindersByTask(Integer taskId) {
        return reminderRepository.findByTaskTaskId(taskId);
    }

    public Reminder getReminderById(Integer id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found with id: " + id));
    }

    public Reminder updateReminder(Integer id, Reminder updated) {
        Reminder existing = getReminderById(id);
        existing.setNotificationTime(updated.getNotificationTime());
        existing.setFrequency(updated.getFrequency());
        return reminderRepository.save(existing);
    }

    public void deleteReminder(Integer id) {
        reminderRepository.deleteById(id);
    }
}
