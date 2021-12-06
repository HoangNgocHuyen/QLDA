package com.dsd.pm.repository;

import com.dsd.pm.domain.Notification;
import com.dsd.pm.enums.NotifyStatusEnum;
import com.dsd.pm.enums.NotifyTypeEnum;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Optional<Notification> findById(Long id);

    List<Notification> findByIdIn(List<Long> id, Pageable pageable);

    List<Notification> findByStatus(NotifyStatusEnum status);

    List<Notification> findByType(NotifyTypeEnum type);
}
