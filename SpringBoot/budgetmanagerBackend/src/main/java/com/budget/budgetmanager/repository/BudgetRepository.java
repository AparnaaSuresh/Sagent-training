package com.budget.budgetmanager.repository;

import com.budget.budgetmanager.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
}
