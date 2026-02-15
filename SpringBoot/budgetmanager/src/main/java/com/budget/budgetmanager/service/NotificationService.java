package com.budget.budgetmanager.service;

import com.budget.budgetmanager.entity.Notification;
import com.budget.budgetmanager.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // CREATE
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    // READ ALL
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // READ BY ID
    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    // READ BY USER
    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUser_UserId(userId);
    }

    // UPDATE
    public Notification updateNotification(Long id, Notification updatedNotification) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setMessage(updatedNotification.getMessage());
                    notification.setNotificationDate(updatedNotification.getNotificationDate());
                    notification.setStatus(updatedNotification.getStatus());
                    notification.setUser(updatedNotification.getUser());
                    return notificationRepository.save(notification);
                })
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    // DELETE
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
