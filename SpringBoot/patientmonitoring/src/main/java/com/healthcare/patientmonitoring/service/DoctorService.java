package com.healthcare.patientmonitoring.service;

import com.healthcare.patientmonitoring.entity.Doctor;
import com.healthcare.patientmonitoring.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // CREATE
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // READ ALL
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // READ BY ID
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // UPDATE
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        Doctor existing = getDoctorById(id);

        existing.setDName(updatedDoctor.getDName());
        existing.setEmail(updatedDoctor.getEmail());
        existing.setPassword(updatedDoctor.getPassword());
        existing.setContactNo(updatedDoctor.getContactNo());
        existing.setSpecialization(updatedDoctor.getSpecialization());
        existing.setAvailabilityStatus(updatedDoctor.getAvailabilityStatus());

        return doctorRepository.save(existing);
    }

    // DELETE
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}
