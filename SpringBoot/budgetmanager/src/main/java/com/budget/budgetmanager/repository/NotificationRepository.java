package com.budget.budgetmanager.repository;

import com.budget.budgetmanager.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Get all notifications for a user
    List<Notification> findByUser_UserId(Long userId);
}
