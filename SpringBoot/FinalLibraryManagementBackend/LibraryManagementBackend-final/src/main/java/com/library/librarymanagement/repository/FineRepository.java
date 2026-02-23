package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Borrow;
import com.library.librarymanagement.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    void deleteByBorrow_Member(com.library.librarymanagement.entity.Member member);
}
