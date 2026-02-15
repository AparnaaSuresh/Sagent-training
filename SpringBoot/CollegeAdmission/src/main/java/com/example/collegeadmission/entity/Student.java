package com.example.collegeadmission.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String role = "STUDENT";   // default role

    private String name;
    private String dob;
    private String phnNo;
    private String email;

    @JsonIgnore
    private String password;

    private String gender;
    private String address;

    @OneToMany(mappedBy = "student")
    @JsonIgnore
    private List<Application> applications;
}
