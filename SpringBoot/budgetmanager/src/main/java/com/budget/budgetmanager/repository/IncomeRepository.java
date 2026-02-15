package com.budget.budgetmanager.repository;

import com.budget.budgetmanager.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income, Long> {
}
