package com.healthcare.patientmonitoring.controller;

import com.healthcare.patientmonitoring.entity.HealthData;
import com.healthcare.patientmonitoring.service.HealthDataService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/healthdata")
public class HealthDataController {

    private final HealthDataService healthDataService;

    public HealthDataController(HealthDataService healthDataService) {
        this.healthDataService = healthDataService;
    }

    // CREATE for specific patient
    @PostMapping("/patient/{patientId}")
    public HealthData addHealthData(@PathVariable Long patientId,
                                    @RequestBody HealthData healthData) {
        return healthDataService.addHealthData(patientId, healthData);
    }
    // GET health data for specific patient
    @GetMapping("/patient/{patientId}")
    public List<HealthData> getHealthDataByPatient(@PathVariable Long patientId) {
        return healthDataService.getHealthDataByPatient(patientId);
    }


    // READ ALL
    @GetMapping
    public List<HealthData> getAllHealthData() {
        return healthDataService.getAllHealthData();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public HealthData getHealthData(@PathVariable Long id) {
        return healthDataService.getHealthDataById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public HealthData updateHealthData(@PathVariable Long id,
                                       @RequestBody HealthData healthData) {
        return healthDataService.updateHealthData(id, healthData);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteHealthData(@PathVariable Long id) {
        healthDataService.deleteHealthData(id);
        return "Health data deleted successfully";
    }
}
