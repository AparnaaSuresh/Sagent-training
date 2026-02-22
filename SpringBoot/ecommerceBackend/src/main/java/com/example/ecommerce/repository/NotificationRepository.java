package com.example.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecommerce.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
