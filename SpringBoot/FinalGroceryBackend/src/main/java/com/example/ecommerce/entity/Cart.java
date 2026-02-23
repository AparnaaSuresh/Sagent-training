package com.example.ecommerce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    @ManyToOne
    @JoinColumn(name = "cos_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "p_id")
    private Product product;

    private Integer quantity;

    private Double cartTotal;

    public Cart() {}

    public Long getCartId() { return cartId; }
    public void setCartId(Long cartId) { this.cartId = cartId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getCartTotal() { return cartTotal; }
    public void setCartTotal(Double cartTotal) { this.cartTotal = cartTotal; }

    @Override
    public String toString() {
        return "Cart{cartId=" + cartId + ", quantity=" + quantity + ", cartTotal=" + cartTotal + "}";
    }
}
