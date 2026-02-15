package com.healthcare.patientmonitoring.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "doctor")
@Data
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
