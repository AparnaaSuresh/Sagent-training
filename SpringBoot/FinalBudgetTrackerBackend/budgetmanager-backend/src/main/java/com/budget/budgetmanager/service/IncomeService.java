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

    public Income createIncome(Income income) {
        return incomeRepository.save(income);
    }

    public List<Income> getAllIncome() {
        return incomeRepository.findAll();
    }

    public Optional<Income> getIncomeById(Long id) {
        return incomeRepository.findById(id);
    }

    public List<Income> getIncomeByUser(Long userId) {
        return incomeRepository.findByUserUserId(userId);
    }

    public Income updateIncome(Long id, Income updatedIncome) {
        Income existing = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found with id: " + id));
        existing.setSource(updatedIncome.getSource());
        existing.setAmount(updatedIncome.getAmount());
        existing.setIncomeDate(updatedIncome.getIncomeDate());
        existing.setUser(updatedIncome.getUser());
        return incomeRepository.save(existing);
    }

    public void deleteIncome(Long id) {
        incomeRepository.deleteById(id);
    }
}
