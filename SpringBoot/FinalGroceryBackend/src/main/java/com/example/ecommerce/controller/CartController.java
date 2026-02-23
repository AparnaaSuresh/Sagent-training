package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @PostMapping("/{customerId}/{productId}/{quantity}")
    public Cart addToCart(@PathVariable Long customerId,
                          @PathVariable Long productId,
                          @PathVariable Integer quantity) {
        return service.addToCart(customerId, productId, quantity);
    }

    @GetMapping
    public List<Cart> getAllCartItems() {
        return service.getAllCartItems();
    }

    @DeleteMapping("/{id}")
    public String deleteCartItem(@PathVariable Long id) {
        service.deleteCartItem(id);
        return "Cart item deleted successfully";
    }
}
