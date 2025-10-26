package com.magnifique.safezone.service;

import com.magnifique.safezone.model.Report;
import com.magnifique.safezone.repository.ReportRepository;
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
    
    public Report saveReport(Report report) {
        return reportRepository.save(report);
    }
    
    public List<Report> getAllReports() {
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
    
    public List<Report> getReportsByStatus(String status) {
        return reportRepository.findByStatus(status, Sort.by("title"));
    }
    
    public Page<Report> getReportsByStatus(String status, Pageable pageable) {
        return reportRepository.findByStatus(status, pageable);
    }
}
