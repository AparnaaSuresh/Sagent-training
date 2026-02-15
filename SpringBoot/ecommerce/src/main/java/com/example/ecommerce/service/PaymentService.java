package com.example.ecommerce.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import com.example.ecommerce.entity.Payment;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.repository.PaymentRepository;
import com.example.ecommerce.repository.OrderRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    public Payment makePayment(Long orderId, String method) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow();

        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setPaymentMethod(method);
        payment.setPaymentStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());

        // 🔥 Update order status automatically
        order.setOrderStatus("PAID");
        orderRepository.save(order);

        return paymentRepository.save(payment);
    }
}
