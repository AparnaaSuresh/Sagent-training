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

    @PostMapping
    public Inventory create(@RequestBody Inventory inventory) {
        Book book = bookRepository.findById(inventory.getBook().getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        inventory.setBook(book);
        return inventoryRepository.save(inventory);
    }

    @GetMapping
    public List<Inventory> getAll() {
        return inventoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public Inventory getById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
    }

    @PutMapping("/{id}")
    public Inventory update(@PathVariable Long id, @RequestBody Inventory updatedInventory) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
        Book book = bookRepository.findById(updatedInventory.getBook().getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        inventory.setBook(book);
        inventory.setTotalCopies(updatedInventory.getTotalCopies());
        inventory.setAvailableCopies(updatedInventory.getAvailableCopies());
        inventory.setLostCopies(updatedInventory.getLostCopies());
        inventory.setDamagedCopies(updatedInventory.getDamagedCopies());
        return inventoryRepository.save(inventory);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
        inventoryRepository.delete(inventory);
        return "Inventory deleted successfully";
    }
}
