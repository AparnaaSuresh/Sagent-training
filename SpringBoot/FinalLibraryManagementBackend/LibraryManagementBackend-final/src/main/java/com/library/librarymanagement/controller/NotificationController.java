package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.entity.Notification;
import com.library.librarymanagement.repository.MemberRepository;
import com.library.librarymanagement.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;

    public NotificationController(NotificationRepository notificationRepository,
                                  MemberRepository memberRepository) {
        this.notificationRepository = notificationRepository;
        this.memberRepository = memberRepository;
    }

    @PostMapping
    public Notification create(@RequestBody Notification notification) {
        Member member = memberRepository.findById(notification.getMember().getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));
        notification.setMember(member);
        return notificationRepository.save(notification);
    }

    @GetMapping
    public List<Notification> getAll() {
        return notificationRepository.findAll();
    }

    @GetMapping("/{id}")
    public Notification getById(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
        return "Notification deleted successfully";
    }
}
