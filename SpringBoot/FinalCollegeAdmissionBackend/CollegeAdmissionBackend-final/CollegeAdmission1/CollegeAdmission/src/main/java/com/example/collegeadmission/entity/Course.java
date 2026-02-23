package com.example.collegeadmission.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    private String name;
    private String duration;
    private String structure;
    private Double fee;

    @OneToMany(mappedBy = "course")
    @JsonIgnore
    private List<Application> applications;
}
