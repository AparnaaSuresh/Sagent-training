package com.healthcare.patientmonitoring.controller;

import com.healthcare.patientmonitoring.entity.Report;
import com.healthcare.patientmonitoring.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService service;

    @PostMapping("/patient/{patientId}/health/{healthId}")
    public Report create(@PathVariable Long patientId, @PathVariable Long healthId,
                         @RequestBody Report report) {
        return service.create(patientId, healthId, report);
    }

    @GetMapping
    public List<Report> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Report getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Report update(@PathVariable Long id, @RequestBody Report report) {
        return service.update(id, report);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Report deleted successfully";
    }
}
