package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Borrow;
import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.repository.BorrowRepository;
import com.library.librarymanagement.repository.MemberRepository;
import com.library.librarymanagement.repository.BookRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/borrow")
public class BorrowController {

    private final BorrowRepository borrowRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;

    public BorrowController(BorrowRepository borrowRepository,
                            MemberRepository memberRepository,
                            BookRepository bookRepository) {
        this.borrowRepository = borrowRepository;
        this.memberRepository = memberRepository;
        this.bookRepository = bookRepository;
    }

    @PostMapping
    public Borrow add(@RequestBody Borrow borrow) {
        return borrowRepository.save(borrow);
    }

    @GetMapping("/{id}")
    public Borrow getById(@PathVariable Long id) {
        return borrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow not found"));
    }

    @GetMapping
    public List<Borrow> getAll() {
        return borrowRepository.findAll();
    }

    @PutMapping("/{id}")
    public Borrow update(@PathVariable Long id, @RequestBody Borrow updatedBorrow) {

        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow not found"));

        Long memberId = updatedBorrow.getMember().getMemberId();
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Long bookId = updatedBorrow.getBook().getBookId();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        borrow.setMember(member);
        borrow.setBook(book);
        borrow.setIssueDate(updatedBorrow.getIssueDate());
        borrow.setDueDate(updatedBorrow.getDueDate());
        borrow.setReturnDate(updatedBorrow.getReturnDate());
        borrow.setStatus(updatedBorrow.getStatus());

        return borrowRepository.save(borrow);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow not found"));

        borrowRepository.delete(borrow);

        return "Borrow deleted successfully";
    }
}
