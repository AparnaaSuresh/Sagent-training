package com.example.collegeadmission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegeadmission.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {}
