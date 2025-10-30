package com.magnifique.safezone.controller;

import com.magnifique.safezone.service.*;
import com.magnifique.safezone.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(value = "/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // CREATE
    @PostMapping(value = "/create")
    public ResponseEntity<String> createNotification(@RequestBody Notification notification) {
        notificationService.saveNotification(notification);
        return new ResponseEntity<>("Notification sent successfully", HttpStatus.CREATED);
    }

    // READ - Get all
    @GetMapping(value = "/all")
    public ResponseEntity<?> getAllNotification() {
        return new ResponseEntity<>(notificationService.getAllNotification(), HttpStatus.OK);
    }

    // READ - Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getNotificationById(@PathVariable UUID id) {
        Optional<Notification> notificationOpt = notificationService.getNotificationById(id);
        if (notificationOpt.isPresent()) {
            return new ResponseEntity<>(notificationOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Notification not found", HttpStatus.NOT_FOUND);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotification(@PathVariable UUID id, @RequestBody Notification notification) {
        String result = notificationService.updateNotification(id, notification);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable UUID id) {
        String result = notificationService.deleteNotification(id);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    // Get notifications by user
    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUser(@PathVariable UUID userId) {
        return notificationService.getNotificationsByUser(userId);
    }

    // Get notifications by user with pagination
    @GetMapping("/user/{userId}/paginated")
    public Page<Notification> getNotificationsByUserPaginated(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationService.getNotificationsByUser(userId, pageable);
    }

    // Get notifications by user and read status
    @GetMapping("/user/{userId}/read/{isRead}")
    public List<Notification> getNotificationsByUserAndReadStatus(
            @PathVariable UUID userId, 
            @PathVariable Boolean isRead) {
        return notificationService.getNotificationsByUserAndReadStatus(userId, isRead);
    }

    // Get notifications by type
    @GetMapping("/type/{type}")
    public List<Notification> getNotificationsByType(@PathVariable String type) {
        return notificationService.getNotificationsByType(type);
    }

    // Get notifications by type with pagination
    @GetMapping("/type/{type}/paginated")
    public Page<Notification> getNotificationsByTypePaginated(
            @PathVariable String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationService.getNotificationsByType(type, pageable);
    }

    // Get unread notifications by user
    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnreadNotificationsByUser(@PathVariable UUID userId) {
        return notificationService.getUnreadNotificationsByUser(userId);
    }

    // Count unread notifications by user
    @GetMapping("/user/{userId}/unread/count")
    public Long countUnreadNotificationsByUser(@PathVariable UUID userId) {
        return notificationService.countUnreadNotificationsByUser(userId);
    }

    // Mark notification as read
    @PutMapping("/{id}/mark-read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable UUID id) {
        String result = notificationService.markNotificationAsRead(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // Mark all notifications as read for a user
    @PutMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<?> markAllNotificationsAsRead(@PathVariable UUID userId) {
        String result = notificationService.markAllNotificationsAsRead(userId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // Get notifications by date range
    @GetMapping("/date-range")
    public List<Notification> getNotificationsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return notificationService.getNotificationsByDateRange(start, end);
    }
}
