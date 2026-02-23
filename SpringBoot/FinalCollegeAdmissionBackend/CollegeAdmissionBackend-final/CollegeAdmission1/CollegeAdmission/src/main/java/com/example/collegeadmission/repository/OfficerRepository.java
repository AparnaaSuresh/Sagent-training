package com.example.collegeadmission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegeadmission.entity.Officer;

public interface OfficerRepository extends JpaRepository<Officer, Long> {}
