package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Payment;
import com.example.ecommerce.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/{orderId}")
    public Payment makePayment(@PathVariable Long orderId,
                               @RequestParam String method) {
        return service.makePayment(orderId, method);
    }
}
