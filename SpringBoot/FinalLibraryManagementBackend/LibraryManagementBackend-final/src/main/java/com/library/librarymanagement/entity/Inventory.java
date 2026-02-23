package com.library.librarymanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    private Integer totalCopies;

    private Integer availableCopies;

    private Integer lostCopies;

    private Integer damagedCopies;

    public Inventory() {}

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

    public Integer getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(Integer totalCopies) {
        this.totalCopies = totalCopies;
    }

    public Integer getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(Integer availableCopies) {
        this.availableCopies = availableCopies;
    }

    public Integer getLostCopies() {
        return lostCopies;
    }

    public void setLostCopies(Integer lostCopies) {
        this.lostCopies = lostCopies;
    }

    public Integer getDamagedCopies() {
        return damagedCopies;
    }

    public void setDamagedCopies(Integer damagedCopies) {
        this.damagedCopies = damagedCopies;
    }
}
