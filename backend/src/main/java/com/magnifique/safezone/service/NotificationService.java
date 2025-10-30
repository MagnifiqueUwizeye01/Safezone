package com.magnifique.safezone.service;

import com.magnifique.safezone.model.Notification;
import com.magnifique.safezone.model.User;
import com.magnifique.safezone.repository.NotificationRepository;
import com.magnifique.safezone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Notification saveNotification(Notification notification) {
        // Load User entity
        if (notification.getUser() != null && notification.getUser().getId() != null) {
            Optional<User> user = userRepository.findById(notification.getUser().getId());
            user.ifPresent(notification::setUser);
        }
        
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getAllNotification() {
        return notificationRepository.findAll();
    }
    
    public Optional<Notification> getNotificationById(UUID id) {
        return notificationRepository.findById(id);
    }
    
    public String updateNotification(UUID id, Notification notification) {
        Optional<Notification> existingNotification = notificationRepository.findById(id);
        if (existingNotification.isPresent()) {
            notification.setId(id);
            notificationRepository.save(notification);
            return "Notification updated successfully";
        }
        return "Notification not found";
    }
    
    public String deleteNotification(UUID id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return "Notification deleted successfully";
        }
        return "Notification not found";
    }
    
    // Get notifications by user
    public List<Notification> getNotificationsByUser(UUID userId) {
        return notificationRepository.findByUserId(userId);
    }
    
    // Get notifications by user with pagination
    public Page<Notification> getNotificationsByUser(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable);
    }
    
    // Get notifications by user and read status
    public List<Notification> getNotificationsByUserAndReadStatus(UUID userId, Boolean isRead) {
        return notificationRepository.findByUserIdAndIsRead(userId, isRead);
    }
    
    // Get notifications by user and read status with pagination
    public Page<Notification> getNotificationsByUserAndReadStatus(UUID userId, Boolean isRead, Pageable pageable) {
        return notificationRepository.findByUserIdAndIsRead(userId, isRead, pageable);
    }
    
    // Get notifications by type
    public List<Notification> getNotificationsByType(String type) {
        return notificationRepository.findByType(type);
    }
    
    // Get notifications by type with pagination
    public Page<Notification> getNotificationsByType(String type, Pageable pageable) {
        return notificationRepository.findByType(type, pageable);
    }
    
    // Get unread notifications by user
    public List<Notification> getUnreadNotificationsByUser(UUID userId) {
        return notificationRepository.findUnreadByUser(userId);
    }
    
    // Get notifications by date range
    public List<Notification> getNotificationsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return notificationRepository.findByDateRange(startDate, endDate);
    }
    
    // Count unread notifications by user
    public Long countUnreadNotificationsByUser(UUID userId) {
        return notificationRepository.countUnreadByUser(userId);
    }
    
    // Mark notification as read
    public String markNotificationAsRead(UUID id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            notification.get().setIsRead(true);
            notificationRepository.save(notification.get());
            return "Notification marked as read";
        }
        return "Notification not found";
    }
    
    // Mark all notifications as read for a user
    public String markAllNotificationsAsRead(UUID userId) {
        List<Notification> unreadNotifications = notificationRepository.findUnreadByUser(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
        return "All notifications marked as read";
    }
}
