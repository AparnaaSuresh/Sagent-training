package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.HealthData;
import com.healthcare.patientmonitoring.entity.Patient;
import com.healthcare.patientmonitoring.repository.HealthDataRepository;
import com.healthcare.patientmonitoring.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthDataService {

    private final HealthDataRepository healthDataRepository;
    private final PatientRepository patientRepository;

    public HealthDataService(HealthDataRepository healthDataRepository,
                             PatientRepository patientRepository) {
        this.healthDataRepository = healthDataRepository;
        this.patientRepository = patientRepository;
    }

    // CREATE health data for patient
    public HealthData addHealthData(Long patientId, HealthData healthData) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        healthData.setPatient(patient);

        return healthDataRepository.save(healthData);
    }

    // READ ALL
    public List<HealthData> getAllHealthData() {
        return healthDataRepository.findAll();
    }

    // READ BY ID
    public HealthData getHealthDataById(Long id) {
        return healthDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Health data not found"));
    }

    // UPDATE
    public HealthData updateHealthData(Long id, HealthData updatedData) {

        HealthData existing = getHealthDataById(id);

        existing.setHeartRate(updatedData.getHeartRate());
        existing.setBloodPressure(updatedData.getBloodPressure());
        existing.setOxygenLevel(updatedData.getOxygenLevel());
        existing.setTemperature(updatedData.getTemperature());
        existing.setRecordedAt(updatedData.getRecordedAt());

        return healthDataRepository.save(existing);
    }
    // GET health data by patient ID
    public List<HealthData> getHealthDataByPatient(Long patientId) {

        return healthDataRepository.findByPatientPatientId(patientId);
    }


    // DELETE
    public void deleteHealthData(Long id) {
        healthDataRepository.deleteById(id);
    }
}
