package com.example.ecommerce.service;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.Customer;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.CustomerRepository;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       CustomerRepository customerRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public Cart addToCart(Long customerId, Long productId, Integer quantity) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = new Cart();
        cart.setCustomer(customer);
        cart.setProduct(product);
        cart.setQuantity(quantity);
        cart.setCartTotal(product.getPrice() * quantity);
        return cartRepository.save(cart);
    }

    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    public void deleteCartItem(Long id) {
        cartRepository.deleteById(id);
    }
}
