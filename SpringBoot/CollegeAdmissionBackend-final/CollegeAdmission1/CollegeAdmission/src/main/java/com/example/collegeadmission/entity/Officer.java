package com.example.collegeadmission.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long officerId;

    private String name;
    private String phnNo;
    private String mail;

    private String password;

    private String role = "OFFICER";   // default role
}
