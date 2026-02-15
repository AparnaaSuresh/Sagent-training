package com.example.collegeadmission.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private String status;
    private LocalDate appliedDate;

    @OneToMany(mappedBy = "application",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    private List<Document> documents;

    @OneToOne(mappedBy = "application",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    private Payment payment;
}
