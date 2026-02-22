package com.example.collegeadmission.controller;

import com.example.collegeadmission.entity.Application;
import com.example.collegeadmission.entity.Payment;
import com.example.collegeadmission.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")   // ← CORS fix
@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService service;

    @PostMapping("/{studentId}/{courseId}")
    public Application apply(@PathVariable Long studentId,
                             @PathVariable Long courseId) {
        return service.apply(studentId, courseId);
    }

    @GetMapping
    public List<Application> getAll() {
        return service.getAll();
    }

    @GetMapping("/{applicationId}")
    public Application getById(@PathVariable Long applicationId) {
        return service.getById(applicationId);
    }

    @PutMapping("/{applicationId}/status")
    public Application updateStatus(@PathVariable Long applicationId,
                                    @RequestParam String status) {
        return service.updateStatus(applicationId, status);
    }

    @PostMapping("/{applicationId}/payment")
    public Payment createPayment(@PathVariable Long applicationId,
                                 @RequestParam String mode) {
        return service.createPayment(applicationId, mode);
    }

    @DeleteMapping("/{applicationId}")
    public String delete(@PathVariable Long applicationId) {
        service.delete(applicationId);
        return "Application deleted successfully";
    }
}