package com.dsd.pm.repository;

import com.dsd.pm.domain.NotificationUser;
import com.dsd.pm.enums.NotifyStatusEnum;
import com.dsd.pm.service.dto.NotificationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationUserRepository extends JpaRepository<NotificationUser, Long> {

    Optional<NotificationUser> findById(Long id);

    List<NotificationUser> findByNotificationIdAndStatus(Long notificationId, NotifyStatusEnum status);

    List<NotificationUser> findByStatus(NotifyStatusEnum status, Pageable pageable);

    Optional<NotificationUser> findByUserIdAndNotificationId(Long userId, Long notiId);

    @Query(value = "select n.id from NotificationUser n " +
                    "where n.username = :username and n.notificationId in (:notiIds) and n.status = :status ")
    List<Long> getIdNotiSentByUser(@Param("username") String username,
                                  @Param("notiIds") List<Long> notiIds,
                                  @Param("status") NotifyStatusEnum status
    );

    @Query(value = "select new com.dsd.pm.service.dto.NotificationDTO(n, nu.status) " +
                    "from NotificationUser nu, Notification n " +
                    "where nu.notificationId = n.id and nu.username = :username and nu.status in (:status)")
    List<NotificationDTO> getNotifyIdByUser(@Param("username") String username,
                                            @Param("status") List<NotifyStatusEnum> status,
                                            Pageable pageable);

    @Query(value = "select count(n) from NotificationUser n " +
        "where n.username = :username and n.status = :status ")
    long countNotcSentByUser(@Param("username") String username, @Param("status") NotifyStatusEnum status);

    @Transactional
    @Modifying
    @Query(value = "update NotificationUser n set n.status = :status where n.id in (:notiIds) ")
    void updateStatus(@Param("notiIds") List<Long> notiIds, @Param("status") NotifyStatusEnum status);
}
