package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Borrow;
import com.library.librarymanagement.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    List<Borrow> findByMember(Member member);

    void deleteByMember(Member member);
}
