package com.budget.budgetmanager.repository;

import com.budget.budgetmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
