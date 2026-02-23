package com.example.ecommerce.service;

import com.example.ecommerce.entity.Category;
import com.example.ecommerce.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public Category saveCategory(Category category) {
        return repository.save(category);
    }

    public List<Category> getAllCategories() {
        return repository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return repository.findById(id);
    }

    public Category updateCategory(Long id, Category details) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setCategoryName(details.getCategoryName());
        category.setDescription(details.getDescription());
        return repository.save(category);
    }

    public void deleteCategory(Long id) {
        repository.deleteById(id);
    }
}
