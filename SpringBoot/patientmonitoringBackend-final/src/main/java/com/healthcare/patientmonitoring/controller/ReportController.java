package com.healthcare.patientmonitoring.controller;

import com.healthcare.patientmonitoring.entity.Report;
import com.healthcare.patientmonitoring.service.ReportService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService service;

    public ReportController(ReportService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping("/patient/{patientId}/health/{healthId}")
    public Report create(
            @PathVariable Long patientId,
            @PathVariable Long healthId,
            @RequestBody Report report) {

        return service.create(patientId, healthId, report);
    }

    // READ ALL
    @GetMapping
    public List<Report> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Report getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Report update(@PathVariable Long id,
                         @RequestBody Report report) {
        return service.update(id, report);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Report deleted successfully";
    }
}
