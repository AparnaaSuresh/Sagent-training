package com.healthcare.patientmonitoring.controller;

import com.healthcare.patientmonitoring.entity.MedicalHistory;
import com.healthcare.patientmonitoring.service.MedicalHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicalhistory")
public class MedicalHistoryController {

    @Autowired
    private MedicalHistoryService service;

    @PostMapping("/patient/{patientId}")
    public MedicalHistory addMedicalHistory(@PathVariable Long patientId,
                                             @RequestBody MedicalHistory history) {
        return service.addMedicalHistory(patientId, history);
    }

    @GetMapping
    public List<MedicalHistory> getAll() {
        return service.getAll();
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalHistory> getByPatient(@PathVariable Long patientId) {
        return service.getByPatient(patientId);
    }

    @PutMapping("/{id}")
    public MedicalHistory update(@PathVariable Long id, @RequestBody MedicalHistory history) {
        return service.update(id, history);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted successfully";
    }
}
