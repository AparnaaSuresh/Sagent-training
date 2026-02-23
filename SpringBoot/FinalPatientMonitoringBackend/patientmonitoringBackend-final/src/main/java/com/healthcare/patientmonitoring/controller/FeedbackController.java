package com.healthcare.patientmonitoring.controller;

import com.healthcare.patientmonitoring.entity.Feedback;
import com.healthcare.patientmonitoring.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService service;

    @PostMapping("/patient/{patientId}/doctor/{doctorId}")
    public Feedback create(@PathVariable Long patientId, @PathVariable Long doctorId,
                           @RequestBody Feedback feedback) {
        return service.create(patientId, doctorId, feedback);
    }

    @GetMapping
    public List<Feedback> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Feedback getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Feedback update(@PathVariable Long id, @RequestBody Feedback feedback) {
        return service.update(id, feedback);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Feedback deleted successfully";
    }
}
