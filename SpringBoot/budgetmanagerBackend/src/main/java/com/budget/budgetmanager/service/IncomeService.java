package com.budget.budgetmanager.service;

import com.budget.budgetmanager.entity.Income;
import com.budget.budgetmanager.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    // CREATE
    public Income createIncome(Income income) {
        return incomeRepository.save(income);
    }

    // READ ALL
    public List<Income> getAllIncome() {
        return incomeRepository.findAll();
    }

    // READ BY ID
    public Optional<Income> getIncomeById(Long id) {
        return incomeRepository.findById(id);
    }

    // UPDATE
    public Income updateIncome(Long id, Income updatedIncome) {
        return incomeRepository.findById(id)
                .map(income -> {
                    income.setSource(updatedIncome.getSource());
                    income.setAmount(updatedIncome.getAmount());
                    income.setIncomeDate(updatedIncome.getIncomeDate());
                    income.setUser(updatedIncome.getUser());
                    return incomeRepository.save(income);
                })
                .orElseThrow(() -> new RuntimeException("Income not found"));
    }

    // DELETE
    public void deleteIncome(Long id) {
        incomeRepository.deleteById(id);
    }
}
