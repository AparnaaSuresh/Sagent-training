package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private Integer quantity;

    private Double totalAmount;

    private LocalDateTime orderDate;

    private String orderStatus;

    private String deliveryAddress;

    private String deliveryPersonName;

    @ManyToOne
    @JoinColumn(name = "cos_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "p_id")
    private Product product;
}
