package com.budget.budgetmanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "savings_goal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goalId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String goalName;

    private Double targetAmount;

    private LocalDate targetDate;

    private LocalDate createdAt = LocalDate.now();
}
