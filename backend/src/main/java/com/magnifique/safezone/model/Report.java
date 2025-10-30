package com.magnifique.safezone.model;

import com.magnifique.safezone.enums.EReportStatus;
import com.magnifique.safezone.enums.EReportType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
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
    @Enumerated(EnumType.STRING)
    private EReportType reportType;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private EReportStatus status;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @OneToOne
    @JoinColumn(name = "location_id")
    private Location location;

    // Constructors
    public Report() {
        this.createdAt = LocalDateTime.now();
        this.status = EReportStatus.PENDING;
    }

    public Report(String title, String description, EReportType reportType, User reporter, Location location) {
        this();
        this.title = title;
        this.description = description;
        this.reportType = reportType;
        this.reporter = reporter;
        this.location = location;
    }

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

    public EReportType getReportType() {
        return reportType;
    }

    public void setReportType(EReportType reportType) {
        this.reportType = reportType;
    }

    public EReportStatus getStatus() {
        return status;
    }

    public void setStatus(EReportStatus status) {
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

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Report{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", reportType=" + reportType +
                ", status=" + status +
                ", reporter=" + (reporter != null ? reporter.getUsername() : "null") +
                ", location=" + (location != null ? location.getName() : "null") +
                ", createdAt=" + createdAt +
                '}';
    }
}
