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
        if (notification.getUser() != null && notification.getUser().getId() != null) {
            Optional<User> user = userRepository.findById(notification.getUser().getId());
            if (user.isEmpty()) {
                throw new RuntimeException("User not found with ID: " + notification.getUser().getId());
            }
            notification.setUser(user.get());
        }
        
        try {
            return notificationRepository.save(notification);
        } catch (Exception e) {
            throw new RuntimeException("Error saving notification: " + e.getMessage());
        }
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
            try {
                if (notification.getUser() != null && notification.getUser().getId() != null) {
                    Optional<User> user = userRepository.findById(notification.getUser().getId());
                    if (user.isEmpty()) {
                        return "User not found with ID: " + notification.getUser().getId();
                    }
                    notification.setUser(user.get());
                }
                
                notification.setId(id);
                notificationRepository.save(notification);
                return "Notification updated successfully";
            } catch (Exception e) {
                return "Error updating notification: " + e.getMessage();
            }
        }
        return "Notification not found";
    }
    
    public String deleteNotification(UUID id) {
        if (notificationRepository.existsById(id)) {
            try {
                notificationRepository.deleteById(id);
                return "Notification deleted successfully";
            } catch (Exception e) {
                return "Cannot delete notification: " + e.getMessage();
            }
        }
        return "Notification not found";
    }
    
    public List<Notification> getNotificationsByUser(UUID userId) {
        return notificationRepository.findByUserId(userId);
    }
    
    public Page<Notification> getNotificationsByUser(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable);
    }
    
    public List<Notification> getNotificationsByUserAndReadStatus(UUID userId, Boolean isRead) {
        return notificationRepository.findByUserIdAndIsRead(userId, isRead);
    }
    
    public Page<Notification> getNotificationsByUserAndReadStatus(UUID userId, Boolean isRead, Pageable pageable) {
        return notificationRepository.findByUserIdAndIsRead(userId, isRead, pageable);
    }
    
    public List<Notification> getNotificationsByType(String type) {
        return notificationRepository.findByType(type);
    }
    
    public Page<Notification> getNotificationsByType(String type, Pageable pageable) {
        return notificationRepository.findByType(type, pageable);
    }
    
    public List<Notification> getUnreadNotificationsByUser(UUID userId) {
        return notificationRepository.findUnreadByUser(userId);
    }
    
    public List<Notification> getNotificationsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return notificationRepository.findByDateRange(startDate, endDate);
    }
    
    public Long countUnreadNotificationsByUser(UUID userId) {
        return notificationRepository.countUnreadByUser(userId);
    }
    
    public String markNotificationAsRead(UUID id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            notification.get().setIsRead(true);
            notificationRepository.save(notification.get());
            return "Notification marked as read";
        }
        return "Notification not found";
    }
    
    public String markAllNotificationsAsRead(UUID userId) {
        List<Notification> unreadNotifications = notificationRepository.findUnreadByUser(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
        return "All notifications marked as read";
    }
}
