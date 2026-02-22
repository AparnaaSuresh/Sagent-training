package com.example.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecommerce.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
}
