package com.example.ecommerce.controller;

import org.springframework.web.bind.annotation.*;

import com.example.ecommerce.entity.Payment;
import com.example.ecommerce.service.PaymentService;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/{orderId}")
    public Payment pay(@PathVariable Long orderId,
                       @RequestParam String method) {

        return service.makePayment(orderId, method);
    }
}
