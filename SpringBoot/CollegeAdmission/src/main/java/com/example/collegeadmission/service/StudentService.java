package com.example.collegeadmission.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.example.collegeadmission.repository.StudentRepository;
import com.example.collegeadmission.entity.Student;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository repository;

    public Student save(Student student) {
        return repository.save(student);
    }

    public List<Student> getAll() {
        return repository.findAll();
    }
    public Student getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student update(Long id, Student updated) {
        Student student = getById(id);

        student.setName(updated.getName());
        student.setDob(updated.getDob());
        student.setEmail(updated.getEmail());
        student.setPhnNo(updated.getPhnNo());
        student.setGender(updated.getGender());
        student.setAddress(updated.getAddress());

        return repository.save(student);
    }


    public void delete(Long id) {
        Student student = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        repository.delete(student);
    }


}
