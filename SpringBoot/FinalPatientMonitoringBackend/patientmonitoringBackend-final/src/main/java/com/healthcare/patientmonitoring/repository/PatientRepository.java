package com.healthcare.patientmonitoring.repository;

import com.healthcare.patientmonitoring.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
