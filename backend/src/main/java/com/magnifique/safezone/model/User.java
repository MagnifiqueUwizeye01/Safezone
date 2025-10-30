package com.magnifique.safezone.model;

import com.magnifique.safezone.enums.EUserRole;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "username", unique = true)
    private String username;
    
    @Column(name = "full_name")
    private String fullName;
    
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "password")
    private String password;
    
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private EUserRole role;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location; // User's location

    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
    }

    public User(String username, String fullName, String email, String phone, String password, EUserRole role) {
        this();
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public EUserRole getRole() { return role; }
    public void setRole(EUserRole role) { this.role = role; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", role=" + role +
                ", location=" + (location != null ? location.getName() : "null") +
                ", createdAt=" + createdAt +
                '}';
    }
}
