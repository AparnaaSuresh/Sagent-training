package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Notification;
import com.library.librarymanagement.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Transactional
    void deleteByMember(Member member);
}
