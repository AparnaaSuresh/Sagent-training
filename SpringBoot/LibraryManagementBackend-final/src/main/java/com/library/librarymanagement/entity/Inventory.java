package com.library.librarymanagement.entity;

import jakarta.persistence.*;

@Entity
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    @OneToOne
    @JoinColumn(name = "book_id")
    private Book book;

    private int totalCopies;
    private int availableCopies;
    private int lostCopies;
    private int damagedCopies;

    // ===== Getters and Setters =====

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(int totalCopies) {
        this.totalCopies = totalCopies;
    }

    public int getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(int availableCopies) {
        this.availableCopies = availableCopies;
    }

    public int getLostCopies() {
        return lostCopies;
    }

    public void setLostCopies(int lostCopies) {
        this.lostCopies = lostCopies;
    }

    public int getDamagedCopies() {
        return damagedCopies;
    }

    public void setDamagedCopies(int damagedCopies) {
        this.damagedCopies = damagedCopies;
    }
}
