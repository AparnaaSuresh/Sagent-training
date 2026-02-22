package com.budget.budgetmanager.repository;

import com.budget.budgetmanager.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
