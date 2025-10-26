package com.magnifique.safezone.repository;

import com.magnifique.safezone.model.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {
    
    // Find by alert type with pagination
    Page<Alert> findByAlertType(String alertType, Pageable pageable);
    
    // Find all with pagination
    Page<Alert> findAll(Pageable pageable);
}
