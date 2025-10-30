package com.magnifique.safezone.service;

import com.magnifique.safezone.enums.EReportStatus;
import com.magnifique.safezone.model.Report;
import com.magnifique.safezone.model.User;
import com.magnifique.safezone.model.Location;
import com.magnifique.safezone.repository.ReportRepository;
import com.magnifique.safezone.repository.UserRepository;
import com.magnifique.safezone.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LocationRepository locationRepository;
    
    public Report saveReport(Report report) {
        if (report.getReporter() != null && report.getReporter().getId() != null) {
            Optional<User> user = userRepository.findById(report.getReporter().getId());
            if (user.isEmpty()) {
                throw new RuntimeException("Reporter not found with ID: " + report.getReporter().getId());
            }
            report.setReporter(user.get());
        }
        
        if (report.getLocation() != null && report.getLocation().getId() != null) {
            Optional<Location> location = locationRepository.findById(report.getLocation().getId());
            if (location.isEmpty()) {
                throw new RuntimeException("Location not found with ID: " + report.getLocation().getId());
            }
            report.setLocation(location.get());
        }
        
        try {
            return reportRepository.save(report);
        } catch (Exception e) {
            throw new RuntimeException("Error saving report: " + e.getMessage());
        }
    }
    
    public List<Report> getAllReport() {
        return reportRepository.findAll();
    }
    
    public Optional<Report> getReportById(UUID id) {
        return reportRepository.findById(id);
    }
    
    public String updateReport(UUID id, Report report) {
        Optional<Report> existingReport = reportRepository.findById(id);
        if (existingReport.isPresent()) {
            try {
                if (report.getReporter() != null && report.getReporter().getId() != null) {
                    Optional<User> user = userRepository.findById(report.getReporter().getId());
                    if (user.isEmpty()) {
                        return "Reporter not found with ID: " + report.getReporter().getId();
                    }
                    report.setReporter(user.get());
                }
                
                if (report.getLocation() != null && report.getLocation().getId() != null) {
                    Optional<Location> location = locationRepository.findById(report.getLocation().getId());
                    if (location.isEmpty()) {
                        return "Location not found with ID: " + report.getLocation().getId();
                    }
                    report.setLocation(location.get());
                }
                
                report.setId(id);
                reportRepository.save(report);
                return "Report updated successfully";
            } catch (Exception e) {
                return "Error updating report: " + e.getMessage();
            }
        }
        return "Report not found";
    }
    
    public String deleteReport(UUID id) {
        if (reportRepository.existsById(id)) {
            try {
                reportRepository.deleteById(id);
                return "Report deleted successfully";
            } catch (Exception e) {
                return "Cannot delete report: " + e.getMessage();
            }
        }
        return "Report not found";
    }
    
    public List<Report> getReportsByStatus(EReportStatus status, Sort sort) {
        return reportRepository.findByStatus(status, sort);
    }
    
    public Page<Report> getReportsByStatus(EReportStatus status, Pageable pageable) {
        return reportRepository.findByStatus(status, pageable);
    }
}
