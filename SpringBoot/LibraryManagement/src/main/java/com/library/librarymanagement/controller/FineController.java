package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Borrow;
import com.library.librarymanagement.entity.Fine;
import com.library.librarymanagement.repository.BorrowRepository;
import com.library.librarymanagement.repository.FineRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fines")
public class FineController {

    private final FineRepository fineRepository;
    private final BorrowRepository borrowRepository;

    public FineController(FineRepository fineRepository,
                          BorrowRepository borrowRepository) {
        this.fineRepository = fineRepository;
        this.borrowRepository = borrowRepository;
    }

    // CREATE
    @PostMapping
    public Fine add(@RequestBody Fine fine) {

        Long borrowId = fine.getBorrow().getBorrowId();

        Borrow borrow = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Borrow not found"));

        fine.setBorrow(borrow);

        return fineRepository.save(fine);
    }

    // READ ALL
    @GetMapping
    public List<Fine> getAll() {
        return fineRepository.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Fine getById(@PathVariable Long id) {
        return fineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fine not found"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public Fine update(@PathVariable Long id, @RequestBody Fine updatedFine) {

        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        Long borrowId = updatedFine.getBorrow().getBorrowId();

        Borrow borrow = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Borrow not found"));

        fine.setBorrow(borrow);
        fine.setFineAmount(updatedFine.getFineAmount());
        fine.setStatus(updatedFine.getStatus());

        return fineRepository.save(fine);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        fineRepository.delete(fine);

        return "Fine deleted successfully";
    }
}
