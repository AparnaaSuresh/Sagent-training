package com.healthcare.patientmonitoring.controller;

import com.healthcare.patientmonitoring.entity.Feedback;
import com.healthcare.patientmonitoring.service.FeedbackService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    // ===============================
    // CREATE
    // ===============================
    @PostMapping("/patient/{patientId}/doctor/{doctorId}")
    public Feedback create(
            @PathVariable Long patientId,
            @PathVariable Long doctorId,
            @RequestBody Feedback feedback) {

        return service.create(patientId, doctorId, feedback);
    }

    // ===============================
    // READ ALL
    // ===============================
    @GetMapping
    public List<Feedback> getAll() {
        return service.getAll();
    }

    // ===============================
    // READ BY ID
    // ===============================
    @GetMapping("/{id}")
    public Feedback getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // ===============================
    // UPDATE
    // ===============================
    @PutMapping("/{id}")
    public Feedback update(@PathVariable Long id,
                           @RequestBody Feedback feedback) {

        return service.update(id, feedback);
    }

    // ===============================
    // DELETE
    // ===============================
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Feedback deleted successfully";
    }
}
