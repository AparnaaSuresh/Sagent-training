package com.budget.budgetmanager.service;

import com.budget.budgetmanager.entity.Budget;
import com.budget.budgetmanager.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Optional<Budget> getBudgetById(Long id) {
        return budgetRepository.findById(id);
    }

    public List<Budget> getBudgetsByUser(Long userId) {
        return budgetRepository.findByUserUserId(userId);
    }

    public Budget updateBudget(Long id, Budget updatedBudget) {
        Budget existing = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));
        existing.setBudgetAmount(updatedBudget.getBudgetAmount());
        existing.setMonthYear(updatedBudget.getMonthYear());
        existing.setUser(updatedBudget.getUser());
        existing.setCategory(updatedBudget.getCategory());
        return budgetRepository.save(existing);
    }

    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}
