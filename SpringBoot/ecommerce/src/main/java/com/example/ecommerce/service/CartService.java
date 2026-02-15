package com.example.ecommerce.service;

import org.springframework.stereotype.Service;
import java.util.List;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.Customer;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.CustomerRepository;
import com.example.ecommerce.repository.ProductRepository;

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

    // ADD TO CART
    public Cart addToCart(Long customerId, Long productId, Integer quantity) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow();

        Product product = productRepository.findById(productId)
                .orElseThrow();

        Cart cart = new Cart();
        cart.setCustomer(customer);
        cart.setProduct(product);
        cart.setQuantity(quantity);

        // 🔥 Important: calculate total
        cart.setCartTotal(product.getPrice() * quantity);

        return cartRepository.save(cart);
    }

    // GET ALL CART ITEMS
    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    // DELETE CART ITEM
    public void deleteCartItem(Long id) {
        cartRepository.deleteById(id);
    }
}
