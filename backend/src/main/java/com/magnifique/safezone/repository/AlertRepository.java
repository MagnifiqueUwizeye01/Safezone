package com.magnifique.safezone.repository;

import com.magnifique.safezone.enums.EAlertType;
import com.magnifique.safezone.model.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {
    
    Page<Alert> findByAlertType(EAlertType alertType, Pageable pageable);
    List<Alert> findByAlertType(EAlertType alertType);
    
    @Query("SELECT a FROM Alert a WHERE a.createdAt BETWEEN :startDate AND :endDate")
    List<Alert> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    Page<Alert> findAll(Pageable pageable);
}
