package com.example.collegeadmission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegeadmission.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {}
