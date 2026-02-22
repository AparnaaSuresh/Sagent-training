package com.example.collegeadmission.controller;

import com.example.collegeadmission.entity.Officer;
import com.example.collegeadmission.repository.OfficerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")   // ← CORS fix
@RestController
@RequestMapping("/officers")
@RequiredArgsConstructor
public class OfficerController {

    private final OfficerRepository repository;

    @PostMapping
    public Officer create(@RequestBody Officer officer) {
        return repository.save(officer);
    }

    @GetMapping
    public List<Officer> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Officer getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Officer deleted successfully";
    }
}