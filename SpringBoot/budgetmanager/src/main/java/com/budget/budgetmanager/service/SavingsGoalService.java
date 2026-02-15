package com.budget.budgetmanager.service;

import com.budget.budgetmanager.entity.SavingsGoal;
import com.budget.budgetmanager.repository.SavingsGoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;

    public SavingsGoalService(SavingsGoalRepository savingsGoalRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
    }

    public SavingsGoal createGoal(SavingsGoal goal) {
        return savingsGoalRepository.save(goal);
    }

    public List<SavingsGoal> getAllGoals() {
        return savingsGoalRepository.findAll();
    }

    public Optional<SavingsGoal> getGoalById(Long id) {
        return savingsGoalRepository.findById(id);
    }

    public SavingsGoal updateGoal(Long id, SavingsGoal updatedGoal) {
        return savingsGoalRepository.findById(id)
                .map(goal -> {
                    goal.setGoalName(updatedGoal.getGoalName());
                    goal.setTargetAmount(updatedGoal.getTargetAmount());
                    goal.setTargetDate(updatedGoal.getTargetDate());
                    return savingsGoalRepository.save(goal);
                })
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    public void deleteGoal(Long id) {
        savingsGoalRepository.deleteById(id);
    }
}
