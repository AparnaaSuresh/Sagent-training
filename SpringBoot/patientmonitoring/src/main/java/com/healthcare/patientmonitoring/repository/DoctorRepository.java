package com.healthcare.patientmonitoring.repository;

import com.healthcare.patientmonitoring.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
