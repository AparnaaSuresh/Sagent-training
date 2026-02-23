package com.healthcare.patientmonitoring.repository;

import com.healthcare.patientmonitoring.entity.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    List<HealthData> findByPatientPatientId(Long patientId);
}
