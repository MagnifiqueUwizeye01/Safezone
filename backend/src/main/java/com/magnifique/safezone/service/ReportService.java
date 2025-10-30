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
            user.ifPresent(report::setReporter);
        }
        
        if (report.getLocation() != null && report.getLocation().getId() != null) {
            Optional<Location> location = locationRepository.findById(report.getLocation().getId());
            location.ifPresent(report::setLocation);
        }
        
        return reportRepository.save(report);
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
            report.setId(id);
            reportRepository.save(report);
            return "Report updated successfully";
        }
        return "Report not found";
    }
    
    public String deleteReport(UUID id) {
        if (reportRepository.existsById(id)) {
            reportRepository.deleteById(id);
            return "Report deleted successfully";
        }
        return "Report not found";
    }
    
    public List<Report> getReportsByStatus(EReportStatus status) {
        return reportRepository.findByStatus(status, Sort.by("title"));
    }
    
    public Page<Report> getReportsByStatus(EReportStatus status, Pageable pageable) {
        return reportRepository.findByStatus(status, pageable);
    }
}
