package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.Patient;
import com.healthcare.patientmonitoring.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // CREATE
    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // READ ALL
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // READ BY ID
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    // UPDATE
    public Patient updatePatient(Long id, Patient updatedPatient) {
        Patient existing = getPatientById(id);

        existing.setPName(updatedPatient.getPName());
        existing.setPMobileNo(updatedPatient.getPMobileNo());
        existing.setMailId(updatedPatient.getMailId());
        existing.setPassword(updatedPatient.getPassword());
        existing.setAddress(updatedPatient.getAddress());
        existing.setGender(updatedPatient.getGender());
        existing.setDob(updatedPatient.getDob());
        existing.setCreatedAt(updatedPatient.getCreatedAt());

        return patientRepository.save(existing);
    }

    // DELETE
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
