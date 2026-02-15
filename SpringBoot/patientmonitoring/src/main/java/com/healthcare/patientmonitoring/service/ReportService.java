package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.HealthData;
import com.healthcare.patientmonitoring.entity.Patient;
import com.healthcare.patientmonitoring.entity.Report;
import com.healthcare.patientmonitoring.repository.HealthDataRepository;
import com.healthcare.patientmonitoring.repository.PatientRepository;
import com.healthcare.patientmonitoring.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final PatientRepository patientRepository;
    private final HealthDataRepository healthDataRepository;

    public ReportService(ReportRepository reportRepository,
                         PatientRepository patientRepository,
                         HealthDataRepository healthDataRepository) {
        this.reportRepository = reportRepository;
        this.patientRepository = patientRepository;
        this.healthDataRepository = healthDataRepository;
    }

    // ============================
    // CREATE
    // ============================
    public Report create(Long patientId, Long healthId, Report report) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        HealthData healthData = healthDataRepository.findById(healthId)
                .orElseThrow(() -> new RuntimeException("HealthData not found"));

        report.setPatient(patient);
        report.setHealthData(healthData);

        return reportRepository.save(report);
    }

    // ============================
    // READ ALL
    // ============================
    public List<Report> getAll() {
        return reportRepository.findAll();
    }

    // ============================
    // READ BY ID
    // ============================
    public Report getById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    // ============================
    // UPDATE
    // ============================
    public Report update(Long id, Report updated) {

        Report existing = getById(id);

        existing.setAppointmentDate(updated.getAppointmentDate());
        existing.setApplicationTime(updated.getApplicationTime());
        existing.setReportDetails(updated.getReportDetails());
        existing.setReportStatus(updated.getReportStatus());

        return reportRepository.save(existing);
    }

    // ============================
    // DELETE
    // ============================
    public void delete(Long id) {
        if (!reportRepository.existsById(id)) {
            throw new RuntimeException("Report not found");
        }
        reportRepository.deleteById(id);
    }
}
