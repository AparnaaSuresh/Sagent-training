package com.example.collegeadmission.config;

import com.example.collegeadmission.entity.Student;
import com.example.collegeadmission.repository.StudentRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;

    public CustomUserDetailsService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        System.out.println("LOGIN ATTEMPT FOR: " + email);

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        System.out.println("FOUND USER: " + student.getEmail());
        System.out.println("ROLE: " + student.getRole());

        return User.builder()
                .username(student.getEmail())
                .password(student.getPassword())
                .authorities(student.getRole())   // IMPORTANT
                .build();
    }
}
