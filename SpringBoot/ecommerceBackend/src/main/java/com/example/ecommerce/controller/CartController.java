package com.example.ecommerce.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    // ADD TO CART
    @PostMapping("/{customerId}/{productId}/{quantity}")
    public Cart addToCart(@PathVariable Long customerId,
                          @PathVariable Long productId,
                          @PathVariable Integer quantity) {
        return service.addToCart(customerId, productId, quantity);
    }

    // GET ALL CART ITEMS
    @GetMapping
    public List<Cart> getAllCartItems() {
        return service.getAllCartItems();
    }

    // DELETE CART ITEM
    @DeleteMapping("/{id}")
    public String deleteCartItem(@PathVariable Long id) {
        service.deleteCartItem(id);
        return "Cart item deleted successfully";
    }
}
