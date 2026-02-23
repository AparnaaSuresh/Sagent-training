package com.healthcare.patientmonitoring.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class MedicalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private String diagnosis;
    private String treatmentDetails;
}
