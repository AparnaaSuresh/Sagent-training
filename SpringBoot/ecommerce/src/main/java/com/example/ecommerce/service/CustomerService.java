package com.example.ecommerce.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.ecommerce.entity.Customer;
import com.example.ecommerce.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Customer saveCustomer(Customer customer) {
        customer.setCreatedAt(java.time.LocalDateTime.now());
        return repository.save(customer);
    }

    // READ ALL
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    // READ BY ID
    public Optional<Customer> getCustomerById(Long id) {
        return repository.findById(id);
    }

    // UPDATE
    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = repository.findById(id).orElseThrow();

        customer.setName(customerDetails.getName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPassword(customerDetails.getPassword());
        customer.setMobileNo(customerDetails.getMobileNo());

        return repository.save(customer);
    }

    // DELETE
    public void deleteCustomer(Long id) {
        repository.deleteById(id);
    }
}
