package com.example.ecommerce.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.ecommerce.entity.Category;
import com.example.ecommerce.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Category saveCategory(Category category) {
        return repository.save(category);
    }

    // READ ALL
    public List<Category> getAllCategories() {
        return repository.findAll();
    }

    // READ BY ID
    public Optional<Category> getCategoryById(Long id) {
        return repository.findById(id);
    }

    // UPDATE
    public Category updateCategory(Long id, Category details) {
        Category category = repository.findById(id).orElseThrow();

        category.setCategoryName(details.getCategoryName());
        category.setDescription(details.getDescription());

        return repository.save(category);
    }

    // DELETE
    public void deleteCategory(Long id) {
        repository.deleteById(id);
    }
}
