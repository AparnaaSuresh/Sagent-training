package com.healthcare.patientmonitoring.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient")
@Data
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long patientId;        // ← changed from int to Long

    private String pName;
    private String pMobileNo;
    private String mailId;
    private String password;
    private String address;
    private String gender;
    private LocalDate dob;
    private LocalDateTime createdAt;
}