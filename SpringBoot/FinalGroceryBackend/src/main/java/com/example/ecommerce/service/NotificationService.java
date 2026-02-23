package com.example.ecommerce.service;

import com.example.ecommerce.entity.Customer;
import com.example.ecommerce.entity.Notification;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(Customer customer, Order order, String message) {
        Notification notification = new Notification();
        notification.setCustomer(customer);
        notification.setOrder(order);
        notification.setMessage(message);
        notification.setSentTime(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
