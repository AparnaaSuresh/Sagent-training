package com.budget.budgetmanager.service;

import com.budget.budgetmanager.entity.Expense;
import com.budget.budgetmanager.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserUserId(userId);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        existing.setAmount(updatedExpense.getAmount());
        existing.setDescription(updatedExpense.getDescription());
        existing.setExpenseDate(updatedExpense.getExpenseDate());
        existing.setUser(updatedExpense.getUser());
        existing.setCategory(updatedExpense.getCategory());
        return expenseRepository.save(existing);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
