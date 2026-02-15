package com.healthcare.patientmonitoring.repository;
import java.util.List;
import com.healthcare.patientmonitoring.entity.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthDataRepository extends JpaRepository<HealthData, Long> {

    List<HealthData> findByPatientPatientId(Long patientId);
}