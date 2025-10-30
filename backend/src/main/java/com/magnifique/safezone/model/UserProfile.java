package com.magnifique.safezone.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "user_profile")
public class UserProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "bio")
    private String bio;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Column(name = "profile_picture_url")
    private String profilePictureUrl;
    
    @Column(name = "preferred_language")
    private String preferredLanguage;
    
    @Column(name = "notification_preferences")
    private String notificationPreferences;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    
    public UserProfile() {
    }
    
    public UserProfile(String bio, LocalDate dateOfBirth, String profilePictureUrl, String preferredLanguage, String notificationPreferences, User user) {
        this.bio = bio;
        this.dateOfBirth = dateOfBirth;
        this.profilePictureUrl = profilePictureUrl;
        this.preferredLanguage = preferredLanguage;
        this.notificationPreferences = notificationPreferences;
        this.user = user;
    }
    
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
    
    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
    
    public String getPreferredLanguage() {
        return preferredLanguage;
    }
    
    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }
    
    public String getNotificationPreferences() {
        return notificationPreferences;
    }
    
    public void setNotificationPreferences(String notificationPreferences) {
        this.notificationPreferences = notificationPreferences;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    @Override
    public String toString() {
        return "UserProfile{" +
                "id=" + id +
                ", bio='" + bio + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", profilePictureUrl='" + profilePictureUrl + '\'' +
                ", preferredLanguage='" + preferredLanguage + '\'' +
                ", notificationPreferences='" + notificationPreferences + '\'' +
                ", user=" + (user != null ? user.getUsername() : "null") +
                '}';
    }
}

