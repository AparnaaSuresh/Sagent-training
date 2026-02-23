package com.example.ecommerce.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long payId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private String paymentMethod;

    private String paymentStatus;

    private LocalDateTime paymentDate;

    public Payment() {}

    public Long getPayId() { return payId; }
    public void setPayId(Long payId) { this.payId = payId; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    @Override
    public String toString() {
        return "Payment{payId=" + payId + ", paymentMethod='" + paymentMethod + "', paymentStatus='" + paymentStatus + "'}";
    }
}
