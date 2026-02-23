package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    void deleteByMember(Member member);
}
