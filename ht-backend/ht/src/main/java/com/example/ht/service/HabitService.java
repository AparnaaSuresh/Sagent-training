package com.example.ht.service;

import com.example.ht.entity.Habit;
import com.example.ht.entity.User;
import com.example.ht.repository.HabitRepository;
import com.example.ht.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HabitService {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserRepository userRepository;

    public Habit createHabit(Integer userId, Habit habit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        habit.setUser(user);
        return habitRepository.save(habit);
    }

    public List<Habit> getHabitsByUser(Integer userId) {
        return habitRepository.findByUserUserId(userId);
    }

    public Habit getHabitById(Integer id) {
        return habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found with id: " + id));
    }

    public Habit updateHabit(Integer id, Habit updated) {
        Habit existing = getHabitById(id);
        existing.setHabitName(updated.getHabitName());
        existing.setFrequency(updated.getFrequency());
        return habitRepository.save(existing);
    }

    public void deleteHabit(Integer id) {
        habitRepository.deleteById(id);
    }
}
