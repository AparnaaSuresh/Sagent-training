package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pId;

    private String productName;

    private Double price;

    private Integer stockQuantity;

    private Boolean availability;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
