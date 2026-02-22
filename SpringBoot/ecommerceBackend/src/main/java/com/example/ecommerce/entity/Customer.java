package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cosId;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;
    private String mobileNo;

    private LocalDateTime createdAt;
}
