package com.example.ht.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "reminders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reminderId;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    @JsonIgnoreProperties({"reminders", "habitLogs"})
    private Task task;

    @Column(nullable = false)
    private LocalTime notificationTime;

    @Column(length = 50)
    private String frequency;

    @Column(length = 255)
    private String message;        // ← ADD THIS
}