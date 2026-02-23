package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.repository.BorrowRepository;
import com.library.librarymanagement.repository.FineRepository;
import com.library.librarymanagement.repository.MemberRepository;
import com.library.librarymanagement.repository.NotificationRepository;
import org.springframework.transaction.annotation.Transactional;
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

    @PostMapping
    public Member create(@RequestBody Member member) {
        return memberRepository.save(member);
    }

    @GetMapping
    public List<Member> getAll() {
        return memberRepository.findAll();
    }

    @GetMapping("/{id}")
    public Member getById(@PathVariable Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

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

    @DeleteMapping("/{id}")
    @Transactional
    public String delete(@PathVariable Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        fineRepository.deleteByBorrow_Member(member);
        borrowRepository.deleteByMember(member);
        notificationRepository.deleteByMember(member);
        memberRepository.delete(member);
        return "Member deleted successfully";
    }
}
