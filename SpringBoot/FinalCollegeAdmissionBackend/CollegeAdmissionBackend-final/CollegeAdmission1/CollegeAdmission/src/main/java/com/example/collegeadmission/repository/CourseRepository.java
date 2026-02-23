package com.example.collegeadmission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegeadmission.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {}
