package com.example.collegeadmission.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.example.collegeadmission.repository.CourseRepository;
import com.example.collegeadmission.entity.Course;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository repository;

    // CREATE
    public Course save(Course course) {
        return repository.save(course);
    }

    // READ ALL
    public List<Course> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Course getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    // UPDATE
    public Course update(Long id, Course updated) {
        Course course = getById(id);

        course.setName(updated.getName());
        course.setDuration(updated.getDuration());
        course.setStructure(updated.getStructure());
        course.setFee(updated.getFee());

        return repository.save(course);
    }

    // DELETE
    public void delete(Long id) {
        Course course = getById(id);
        repository.delete(course);
    }
}
