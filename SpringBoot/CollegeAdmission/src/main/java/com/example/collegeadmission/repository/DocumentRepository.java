package com.example.collegeadmission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegeadmission.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {}
