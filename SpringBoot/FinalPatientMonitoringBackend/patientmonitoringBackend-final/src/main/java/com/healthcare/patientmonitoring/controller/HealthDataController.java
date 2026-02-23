package com.healthcare.patientmonitoring.controller;

import com.healthcare.patientmonitoring.entity.HealthData;
import com.healthcare.patientmonitoring.service.HealthDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/healthdata")
public class HealthDataController {

    @Autowired
    private HealthDataService healthDataService;

    @PostMapping("/patient/{patientId}")
    public HealthData addHealthData(@PathVariable Long patientId, @RequestBody HealthData healthData) {
        return healthDataService.addHealthData(patientId, healthData);
    }

    @GetMapping
    public List<HealthData> getAllHealthData() {
        return healthDataService.getAllHealthData();
    }

    @GetMapping("/{id}")
    public HealthData getHealthData(@PathVariable Long id) {
        return healthDataService.getHealthDataById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<HealthData> getHealthDataByPatient(@PathVariable Long patientId) {
        return healthDataService.getHealthDataByPatient(patientId);
    }

    @PutMapping("/{id}")
    public HealthData updateHealthData(@PathVariable Long id, @RequestBody HealthData healthData) {
        return healthDataService.updateHealthData(id, healthData);
    }

    @DeleteMapping("/{id}")
    public String deleteHealthData(@PathVariable Long id) {
        healthDataService.deleteHealthData(id);
        return "Health data deleted successfully";
    }
}
