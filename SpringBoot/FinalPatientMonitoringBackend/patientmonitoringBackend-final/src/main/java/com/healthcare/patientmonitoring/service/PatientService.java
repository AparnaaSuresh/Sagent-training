package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.Patient;
import com.healthcare.patientmonitoring.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

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

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
