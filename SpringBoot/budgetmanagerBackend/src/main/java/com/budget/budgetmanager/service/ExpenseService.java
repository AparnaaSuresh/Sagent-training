package com.budget.budgetmanager.service;

import com.budget.budgetmanager.entity.Expense;
import com.budget.budgetmanager.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
    public Expense updateExpense(Long id, Expense updatedExpense) {
        return expenseRepository.findById(id)
                .map(expense -> {
                    expense.setAmount(updatedExpense.getAmount());
                    expense.setDescription(updatedExpense.getDescription());
                    expense.setExpenseDate(updatedExpense.getExpenseDate());
                    expense.setUser(updatedExpense.getUser());
                    expense.setCategory(updatedExpense.getCategory());
                    return expenseRepository.save(expense);
                })
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

}
