package com.magnifique.safezone.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "report")
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "report_type")
    private String reportType; // theft, violence, harassment, etc.

    @Column(name = "status")
    private String status; // pending, in_progress, resolved

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @OneToOne
    @JoinColumn(name = "location_id")
    private Location location;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}
