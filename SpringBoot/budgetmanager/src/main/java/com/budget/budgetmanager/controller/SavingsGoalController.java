package com.budget.budgetmanager.controller;

import com.budget.budgetmanager.entity.SavingsGoal;
import com.budget.budgetmanager.service.SavingsGoalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    @PostMapping
    public SavingsGoal createGoal(@RequestBody SavingsGoal goal) {
        return savingsGoalService.createGoal(goal);
    }

    @GetMapping
    public List<SavingsGoal> getAllGoals() {
        return savingsGoalService.getAllGoals();
    }

    @GetMapping("/{id}")
    public SavingsGoal getGoalById(@PathVariable Long id) {
        return savingsGoalService.getGoalById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    @PutMapping("/{id}")
    public SavingsGoal updateGoal(@PathVariable Long id,
                                  @RequestBody SavingsGoal goal) {
        return savingsGoalService.updateGoal(id, goal);
    }

    @DeleteMapping("/{id}")
    public String deleteGoal(@PathVariable Long id) {
        savingsGoalService.deleteGoal(id);
        return "Goal deleted successfully";
    }
}
