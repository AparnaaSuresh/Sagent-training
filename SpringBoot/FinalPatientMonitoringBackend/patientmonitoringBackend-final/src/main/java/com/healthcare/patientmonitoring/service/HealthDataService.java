package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.HealthData;
import com.healthcare.patientmonitoring.entity.Patient;
import com.healthcare.patientmonitoring.repository.HealthDataRepository;
import com.healthcare.patientmonitoring.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthDataService {

    @Autowired
    private HealthDataRepository healthDataRepository;

    @Autowired
    private PatientRepository patientRepository;

    public HealthData addHealthData(Long patientId, HealthData healthData) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        healthData.setPatient(patient);
        return healthDataRepository.save(healthData);
    }

    public List<HealthData> getAllHealthData() {
        return healthDataRepository.findAll();
    }

    public HealthData getHealthDataById(Long id) {
        return healthDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Health data not found"));
    }

    public List<HealthData> getHealthDataByPatient(Long patientId) {
        return healthDataRepository.findByPatientPatientId(patientId);
    }

    public HealthData updateHealthData(Long id, HealthData updatedData) {
        HealthData existing = getHealthDataById(id);
        existing.setHeartRate(updatedData.getHeartRate());
        existing.setBloodPressure(updatedData.getBloodPressure());
        existing.setOxygenLevel(updatedData.getOxygenLevel());
        existing.setTemperature(updatedData.getTemperature());
        existing.setRecordedAt(updatedData.getRecordedAt());
        return healthDataRepository.save(existing);
    }

    public void deleteHealthData(Long id) {
        healthDataRepository.deleteById(id);
    }
}
