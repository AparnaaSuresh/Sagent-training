package com.example.collegeadmission.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.util.List;

import com.example.collegeadmission.repository.*;
import com.example.collegeadmission.entity.*;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final PaymentRepository paymentRepository;

    // ===============================
    // CREATE APPLICATION
    // ===============================
    public Application apply(Long studentId, Long courseId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Application application = new Application();
        application.setStudent(student);
        application.setCourse(course);
        application.setStatus("PENDING");
        application.setAppliedDate(LocalDate.now());

        return applicationRepository.save(application);
    }

    // ===============================
    // UPDATE STATUS
    // ===============================
    public Application updateStatus(Long applicationId, String status) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status.toUpperCase());

        return applicationRepository.save(application);
    }

    // ===============================
    // CREATE PAYMENT
    // ===============================
    public Payment createPayment(Long applicationId, String mode) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getStatus().equals("APPROVED")) {
            throw new RuntimeException("Application not approved yet");
        }

        Payment payment = new Payment();
        payment.setApplication(application);
        payment.setPaymentMode(mode);
        payment.setStatus("PAID");
        payment.setPaymentDate(LocalDate.now());
        payment.setDeadline(LocalDate.now().plusDays(7));

        return paymentRepository.save(payment);
    }

    // ===============================
    // GET ALL APPLICATIONS
    // ===============================
    public List<Application> getAll() {
        return applicationRepository.findAll();
    }

    // ===============================
    // GET BY ID
    // ===============================
    public Application getById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
    public void delete(Long id) {

        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Application not found");
        }

        applicationRepository.deleteById(id);
    }

}
