package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Fine;
import com.library.librarymanagement.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface FineRepository extends JpaRepository<Fine, Long> {

    @Transactional
    void deleteByBorrow_Member(Member member);
}
