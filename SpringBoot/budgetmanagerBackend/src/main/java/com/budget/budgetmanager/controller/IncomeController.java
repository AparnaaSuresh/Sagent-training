package com.budget.budgetmanager.controller;

import com.budget.budgetmanager.entity.Income;
import com.budget.budgetmanager.service.IncomeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/income")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    // CREATE
    @PostMapping
    public Income createIncome(@RequestBody Income income) {
        return incomeService.createIncome(income);
    }

    // READ ALL
    @GetMapping
    public List<Income> getAllIncome() {
        return incomeService.getAllIncome();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Income getIncomeById(@PathVariable Long id) {
        return incomeService.getIncomeById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public Income updateIncome(@PathVariable Long id,
                               @RequestBody Income income) {
        return incomeService.updateIncome(id, income);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return "Income deleted successfully";
    }
}
