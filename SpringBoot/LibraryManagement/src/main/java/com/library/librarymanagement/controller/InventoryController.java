package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.entity.Inventory;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.repository.InventoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryRepository inventoryRepository;
    private final BookRepository bookRepository;

    public InventoryController(InventoryRepository inventoryRepository,
                               BookRepository bookRepository) {
        this.inventoryRepository = inventoryRepository;
        this.bookRepository = bookRepository;
    }

    // CREATE
    @PostMapping
    public Inventory add(@RequestBody Inventory inventory) {

        Long bookId = inventory.getBook().getBookId();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        inventory.setBook(book);

        return inventoryRepository.save(inventory);
    }

    // READ ALL
    @GetMapping
    public List<Inventory> getAll() {
        return inventoryRepository.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Inventory getById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public Inventory update(@PathVariable Long id,
                            @RequestBody Inventory updatedInventory) {

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        Long bookId = updatedInventory.getBook().getBookId();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        inventory.setBook(book);
        inventory.setTotalCopies(updatedInventory.getTotalCopies());
        inventory.setAvailableCopies(updatedInventory.getAvailableCopies());

        return inventoryRepository.save(inventory);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventoryRepository.delete(inventory);

        return "Inventory deleted successfully";
    }
}
