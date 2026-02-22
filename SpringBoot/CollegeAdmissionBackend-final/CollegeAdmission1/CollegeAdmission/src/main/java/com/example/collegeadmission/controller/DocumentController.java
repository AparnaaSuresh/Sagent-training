package com.example.collegeadmission.controller;

import com.example.collegeadmission.entity.Document;
import com.example.collegeadmission.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")   // ← CORS fix
@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentRepository repository;

    @PostMapping
    public Document create(@RequestBody Document document) {
        return repository.save(document);
    }

    @GetMapping
    public List<Document> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Document getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "Document deleted successfully";
    }
}