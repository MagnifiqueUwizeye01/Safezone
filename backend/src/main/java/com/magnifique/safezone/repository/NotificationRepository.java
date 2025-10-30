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
    
    // Find by user
    List<Notification> findByUserId(UUID userId);
    
    // Find by user with pagination
    Page<Notification> findByUserId(UUID userId, Pageable pageable);
    
    // Find by user and read status
    List<Notification> findByUserIdAndIsRead(UUID userId, Boolean isRead);
    
    // Find by user and read status with pagination
    Page<Notification> findByUserIdAndIsRead(UUID userId, Boolean isRead, Pageable pageable);
    
    // Find by type
    List<Notification> findByType(String type);
    
    // Find by type with pagination
    Page<Notification> findByType(String type, Pageable pageable);
    
    // Find by read status
    List<Notification> findByIsRead(Boolean isRead);
    
    // Find by read status with pagination
    Page<Notification> findByIsRead(Boolean isRead, Pageable pageable);
    
    // Find unread notifications by user
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUser(@Param("userId") UUID userId);
    
    // Find notifications by date range
    @Query("SELECT n FROM Notification n WHERE n.createdAt BETWEEN :startDate AND :endDate")
    List<Notification> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Count unread notifications by user
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    Long countUnreadByUser(@Param("userId") UUID userId);
    
    // Find all with pagination
    Page<Notification> findAll(Pageable pageable);
}
