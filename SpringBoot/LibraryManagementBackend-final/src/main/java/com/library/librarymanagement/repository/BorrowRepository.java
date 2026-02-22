package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Borrow;
import com.library.librarymanagement.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    @Transactional
    void deleteByMember(Member member);
}
