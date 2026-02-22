package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.Feedback;
import com.healthcare.patientmonitoring.entity.Patient;
import com.healthcare.patientmonitoring.entity.Doctor;
import com.healthcare.patientmonitoring.repository.FeedbackRepository;
import com.healthcare.patientmonitoring.repository.PatientRepository;
import com.healthcare.patientmonitoring.repository.DoctorRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           PatientRepository patientRepository,
                           DoctorRepository doctorRepository) {
        this.feedbackRepository = feedbackRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    // ===============================
    // CREATE
    // ===============================
    public Feedback create(Long patientId, Long doctorId, Feedback feedback) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        feedback.setPatient(patient);
        feedback.setDoctor(doctor);

        return feedbackRepository.save(feedback);
    }

    // ===============================
    // READ ALL
    // ===============================
    public List<Feedback> getAll() {
        return feedbackRepository.findAll();
    }

    // ===============================
    // READ BY ID
    // ===============================
    public Feedback getById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    // ===============================
    // UPDATE
    // ===============================
    public Feedback update(Long id, Feedback updatedFeedback) {

        Feedback existing = getById(id);

        existing.setMessage(updatedFeedback.getMessage());

        return feedbackRepository.save(existing);
    }

    // ===============================
    // DELETE
    // ===============================
    public void delete(Long id) {
        feedbackRepository.deleteById(id);
    }
}
