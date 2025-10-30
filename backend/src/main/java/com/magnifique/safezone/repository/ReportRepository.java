package com.magnifique.safezone.repository;

import com.magnifique.safezone.enums.EReportStatus;
import com.magnifique.safezone.enums.EReportType;
import com.magnifique.safezone.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    
    List<Report> findByStatus(EReportStatus status, Sort sort);
    Page<Report> findByStatus(EReportStatus status, Pageable pageable);
    
    List<Report> findByReportType(EReportType reportType);
    Page<Report> findByReportType(EReportType reportType, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.createdAt BETWEEN :startDate AND :endDate")
    List<Report> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT r FROM Report r WHERE r.location.code = :locationCode")
    List<Report> findByLocationCode(@Param("locationCode") String locationCode);
    
    Page<Report> findAll(Pageable pageable);
}
