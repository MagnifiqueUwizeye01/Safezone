package com.magnifique.safezone.repository;

import com.magnifique.safezone.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    
    // Find by status with sorting
    List<Report> findByStatus(String status, Sort sort);
    
    // Find by status with pagination
    Page<Report> findByStatus(String status, Pageable pageable);
    
    // Find by report type
    List<Report> findByReportType(String reportType);
    
    // Find all with pagination
    Page<Report> findAll(Pageable pageable);
}
