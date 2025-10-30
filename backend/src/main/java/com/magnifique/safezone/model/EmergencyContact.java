package com.magnifique.safezone.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "emergency_contacts")
public class EmergencyContact {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "department")
    private String department; // Police, Fire, Medical, etc.
    
    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;
    
    @Column(name = "is_active")
    private Boolean isActive = true;

    // Constructors
    public EmergencyContact() {
    }

    public EmergencyContact(String name, String phone, String email, String department, Location location) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.department = department;
        this.location = location;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public Location getLocation() {
        return location;
    }
    
    public void setLocation(Location location) {
        this.location = location;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    @Override
    public String toString() {
        return "EmergencyContact{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", department='" + department + '\'' +
                ", location=" + (location != null ? location.getName() : "null") +
                ", isActive=" + isActive +
                '}';
    }
}
