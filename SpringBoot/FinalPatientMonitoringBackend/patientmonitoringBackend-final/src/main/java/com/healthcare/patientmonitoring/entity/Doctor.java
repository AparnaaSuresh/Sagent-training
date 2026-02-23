package com.healthcare.patientmonitoring.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long doctorId;

    private String dName;
    private String email;
    private String password;
    private String contactNo;
    private String specialization;
    private String availabilityStatus;
}
