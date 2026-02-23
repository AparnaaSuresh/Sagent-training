package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Notification;
import com.example.ecommerce.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Notification> getAll() {
        return service.getAllNotifications();
    }
}
