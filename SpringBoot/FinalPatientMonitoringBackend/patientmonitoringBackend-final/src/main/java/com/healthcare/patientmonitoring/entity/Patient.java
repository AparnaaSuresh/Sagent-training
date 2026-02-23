package com.healthcare.patientmonitoring.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long patientId;

    private String pName;
    private String pMobileNo;
    private String mailId;
    private String password;
    private String address;
    private String gender;
    private LocalDate dob;
    private LocalDateTime createdAt;
}
