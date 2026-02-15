package com.example.ecommerce.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    // PLACE ORDER
    @PostMapping("/{customerId}/{productId}/{quantity}")
    public Order placeOrder(@PathVariable Long customerId,
                            @PathVariable Long productId,
                            @PathVariable Integer quantity,
                            @RequestParam String deliveryAddress) {

        return service.placeOrder(customerId, productId, quantity, deliveryAddress);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return service.getAllOrders();
    }

    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        service.deleteOrder(id);
        return "Order deleted successfully";
    }
}
