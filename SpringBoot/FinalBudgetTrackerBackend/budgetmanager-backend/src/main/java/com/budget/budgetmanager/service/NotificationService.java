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

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserUserId(userId);
    }

    public Notification updateNotification(Long id, Notification updatedNotification) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        existing.setMessage(updatedNotification.getMessage());
        existing.setStatus(updatedNotification.getStatus());
        existing.setNotificationDate(updatedNotification.getNotificationDate());
        existing.setUser(updatedNotification.getUser());
        return notificationRepository.save(existing);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
