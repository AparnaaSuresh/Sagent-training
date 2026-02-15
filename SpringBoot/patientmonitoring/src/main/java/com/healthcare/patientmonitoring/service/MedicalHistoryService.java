package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.MedicalHistory;
import com.healthcare.patientmonitoring.entity.Patient;
import com.healthcare.patientmonitoring.repository.MedicalHistoryRepository;
import com.healthcare.patientmonitoring.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalHistoryService {

    private final MedicalHistoryRepository medicalHistoryRepository;
    private final PatientRepository patientRepository;

    public MedicalHistoryService(MedicalHistoryRepository medicalHistoryRepository,
                                 PatientRepository patientRepository) {
        this.medicalHistoryRepository = medicalHistoryRepository;
        this.patientRepository = patientRepository;
    }

    // CREATE
    public MedicalHistory addMedicalHistory(Long patientId, MedicalHistory history) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        history.setPatient(patient);
        return medicalHistoryRepository.save(history);
    }

    // READ ALL
    public List<MedicalHistory> getAll() {
        return medicalHistoryRepository.findAll();
    }

    // READ BY PATIENT
    public List<MedicalHistory> getByPatient(Long patientId) {
        return medicalHistoryRepository.findByPatientPatientId(patientId);
    }

    // UPDATE
    public MedicalHistory update(Long id, MedicalHistory updated) {

        MedicalHistory existing = medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("History not found"));

        existing.setDiagnosis(updated.getDiagnosis());
        existing.setTreatmentDetails(updated.getTreatmentDetails());

        return medicalHistoryRepository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        medicalHistoryRepository.deleteById(id);
    }
}
