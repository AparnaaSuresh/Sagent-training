package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Notification;
import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.repository.NotificationRepository;
import com.library.librarymanagement.repository.MemberRepository;
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

    // CREATE
    @PostMapping
    public Notification add(@RequestBody Notification notification) {

        Long memberId = notification.getMember().getMemberId();

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        notification.setMember(member);

        return notificationRepository.save(notification);
    }

    // GET ALL
    @GetMapping
    public List<Notification> getAll() {
        return notificationRepository.findAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Notification getById(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notificationRepository.delete(notification);

        return "Notification deleted successfully";
    }
}
