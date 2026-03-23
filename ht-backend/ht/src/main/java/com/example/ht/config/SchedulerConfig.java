package com.example.ht.config;

import com.example.ht.entity.Reminder;
import com.example.ht.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalTime;
import java.util.List;

@Configuration
public class SchedulerConfig {

    @Autowired
    private ReminderRepository reminderRepository;


    @Scheduled(fixedRate = 60000)
    public void checkReminders() {
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);
        List<Reminder> dueReminders = reminderRepository.findByNotificationTime(now);

        for (Reminder reminder : dueReminders) {

            System.out.println("REMINDER DUE: Task ID " + reminder.getTask().getTaskId()
                    + " | Frequency: " + reminder.getFrequency()
                    + " | Time: " + reminder.getNotificationTime());
        }
    }
}
