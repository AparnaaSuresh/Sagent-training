package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.repository.MemberRepository;
import com.library.librarymanagement.repository.BorrowRepository;
import com.library.librarymanagement.repository.NotificationRepository;
import com.library.librarymanagement.repository.FineRepository;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/members")
public class MemberController {

    private final MemberRepository memberRepository;
    private final BorrowRepository borrowRepository;
    private final NotificationRepository notificationRepository;
    private final FineRepository fineRepository;

    public MemberController(MemberRepository memberRepository,
                            BorrowRepository borrowRepository,
                            NotificationRepository notificationRepository,
                            FineRepository fineRepository) {

        this.memberRepository = memberRepository;
        this.borrowRepository = borrowRepository;
        this.notificationRepository = notificationRepository;
        this.fineRepository = fineRepository;
    }

    // ---------------- CREATE ----------------
    @PostMapping
    public Member add(@RequestBody Member member) {
        return memberRepository.save(member);
    }

    // ---------------- READ ALL ----------------
    @GetMapping
    public List<Member> getAll() {
        return memberRepository.findAll();
    }

    // ---------------- READ BY ID ----------------
    @GetMapping("/{id}")
    public Member getById(@PathVariable Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    // ---------------- UPDATE ----------------
    @PutMapping("/{id}")
    public Member update(@PathVariable Long id, @RequestBody Member updatedMember) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.setName(updatedMember.getName());
        member.setPhoneNo(updatedMember.getPhoneNo());
        member.setEmail(updatedMember.getEmail());
        member.setPassword(updatedMember.getPassword());
        member.setAddress(updatedMember.getAddress());
        member.setCategory(updatedMember.getCategory());

        return memberRepository.save(member);
    }

    // ---------------- DELETE (Correct Order) ----------------
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // 1️⃣ Delete fines (deepest dependency)
        fineRepository.deleteByBorrow_Member(member);

        // 2️⃣ Delete borrows
        borrowRepository.deleteByMember(member);

        // 3️⃣ Delete notifications
        notificationRepository.deleteByMember(member);

        // 4️⃣ Delete member
        memberRepository.delete(member);

        return "Member deleted successfully";
    }
}
