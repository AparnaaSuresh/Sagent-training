package com.example.ecommerce.service;

import org.springframework.stereotype.Service;
import java.util.List;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.Category;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.CategoryRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // CREATE
    public Product saveProduct(Product product, Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow();

        product.setCategory(category);

        return productRepository.save(product);
    }

    // READ ALL
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // READ BY ID
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow();
    }

    // UPDATE
    public Product updateProduct(Long id, Product updatedProduct, Long categoryId) {

        Product product = productRepository.findById(id).orElseThrow();

        product.setProductName(updatedProduct.getProductName());
        product.setPrice(updatedProduct.getPrice());
        product.setStockQuantity(updatedProduct.getStockQuantity());
        product.setAvailability(updatedProduct.getAvailability());

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow();

        product.setCategory(category);

        return productRepository.save(product);
    }

    // DELETE
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
