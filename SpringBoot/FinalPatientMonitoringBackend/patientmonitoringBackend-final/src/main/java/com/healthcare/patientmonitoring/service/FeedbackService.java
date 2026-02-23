package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.Doctor;
import com.healthcare.patientmonitoring.entity.Feedback;
import com.healthcare.patientmonitoring.entity.Patient;
import com.healthcare.patientmonitoring.repository.DoctorRepository;
import com.healthcare.patientmonitoring.repository.FeedbackRepository;
import com.healthcare.patientmonitoring.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public Feedback create(Long patientId, Long doctorId, Feedback feedback) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        feedback.setPatient(patient);
        feedback.setDoctor(doctor);
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAll() {
        return feedbackRepository.findAll();
    }

    public Feedback getById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    public Feedback update(Long id, Feedback updatedFeedback) {
        Feedback existing = getById(id);
        existing.setMessage(updatedFeedback.getMessage());
        return feedbackRepository.save(existing);
    }

    public void delete(Long id) {
        feedbackRepository.deleteById(id);
    }
}
