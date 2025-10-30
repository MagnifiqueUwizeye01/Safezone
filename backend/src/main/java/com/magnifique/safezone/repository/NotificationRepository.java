package com.magnifique.safezone.repository;

import com.magnifique.safezone.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    
    List<Notification> findByUserId(UUID userId);
    Page<Notification> findByUserId(UUID userId, Pageable pageable);
    
    List<Notification> findByUserIdAndIsRead(UUID userId, Boolean isRead);
    Page<Notification> findByUserIdAndIsRead(UUID userId, Boolean isRead, Pageable pageable);
    
    List<Notification> findByType(String type);
    Page<Notification> findByType(String type, Pageable pageable);
    
    List<Notification> findByIsRead(Boolean isRead);
    Page<Notification> findByIsRead(Boolean isRead, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUser(@Param("userId") UUID userId);
    
    @Query("SELECT n FROM Notification n WHERE n.createdAt BETWEEN :startDate AND :endDate")
    List<Notification> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    Long countUnreadByUser(@Param("userId") UUID userId);
    
    Page<Notification> findAll(Pageable pageable);
}
