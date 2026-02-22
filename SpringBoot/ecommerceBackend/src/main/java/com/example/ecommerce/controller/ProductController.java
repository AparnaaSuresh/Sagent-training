package com.example.ecommerce.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.service.ProductService;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping("/{categoryId}")
    public Product createProduct(@RequestBody Product product,
                                 @PathVariable Long categoryId) {
        return service.saveProduct(product, categoryId);
    }

    // READ ALL
    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return service.getProductById(id);
    }

    // UPDATE
    @PutMapping("/{id}/{categoryId}")
    public Product updateProduct(@PathVariable Long id,
                                 @PathVariable Long categoryId,
                                 @RequestBody Product product) {
        return service.updateProduct(id, product, categoryId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
        return "Product deleted successfully";
    }
}
