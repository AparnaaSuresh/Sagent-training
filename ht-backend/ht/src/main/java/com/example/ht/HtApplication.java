package com.example.ht;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HtApplication {
    public static void main(String[] args) {
        SpringApplication.run(HtApplication.class, args);
    }
}
