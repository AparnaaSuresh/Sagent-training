package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long payId;

    private String paymentMethod;

    private String paymentStatus;

    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
