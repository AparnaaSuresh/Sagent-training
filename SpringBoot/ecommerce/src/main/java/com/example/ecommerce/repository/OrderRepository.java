package com.example.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecommerce.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
