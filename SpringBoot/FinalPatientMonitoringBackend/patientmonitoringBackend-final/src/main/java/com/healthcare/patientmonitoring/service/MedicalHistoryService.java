package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.MedicalHistory;
import com.healthcare.patientmonitoring.entity.Patient;
import com.healthcare.patientmonitoring.repository.MedicalHistoryRepository;
import com.healthcare.patientmonitoring.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalHistoryService {

    @Autowired
    private MedicalHistoryRepository medicalHistoryRepository;

    @Autowired
    private PatientRepository patientRepository;

    public MedicalHistory addMedicalHistory(Long patientId, MedicalHistory history) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        history.setPatient(patient);
        return medicalHistoryRepository.save(history);
    }

    public List<MedicalHistory> getAll() {
        return medicalHistoryRepository.findAll();
    }

    public List<MedicalHistory> getByPatient(Long patientId) {
        return medicalHistoryRepository.findByPatientPatientId(patientId);
    }

    public MedicalHistory update(Long id, MedicalHistory updated) {
        MedicalHistory existing = medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("History not found"));
        existing.setDiagnosis(updated.getDiagnosis());
        existing.setTreatmentDetails(updated.getTreatmentDetails());
        return medicalHistoryRepository.save(existing);
    }

    public void delete(Long id) {
        medicalHistoryRepository.deleteById(id);
    }
}
