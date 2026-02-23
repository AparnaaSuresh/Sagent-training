package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping("/{categoryId}")
    public Product createProduct(@RequestBody Product product, @PathVariable Long categoryId) {
        return service.saveProduct(product, categoryId);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return service.getProductById(id);
    }

    @PutMapping("/{id}/{categoryId}")
    public Product updateProduct(@PathVariable Long id,
                                 @PathVariable Long categoryId,
                                 @RequestBody Product product) {
        return service.updateProduct(id, product, categoryId);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
        return "Product deleted successfully";
    }
}
