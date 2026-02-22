package com.healthcare.patientmonitoring.repository;

import com.healthcare.patientmonitoring.entity.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {

    List<MedicalHistory> findByPatientPatientId(Long patientId);
}
