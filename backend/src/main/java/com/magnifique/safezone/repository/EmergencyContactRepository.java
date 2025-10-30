package com.magnifique.safezone.repository;

import com.magnifique.safezone.model.EmergencyContact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, UUID> {
    
    Boolean existsByPhone(String phone);
    Boolean existsByEmail(String email);
    
    Optional<EmergencyContact> findByPhone(String phone);
    Optional<EmergencyContact> findByEmail(String email);
    
    List<EmergencyContact> findByDepartment(String department, Sort sort);
    Page<EmergencyContact> findByDepartment(String department, Pageable pageable);
    
    List<EmergencyContact> findByLocationId(UUID locationId);
    
    List<EmergencyContact> findByIsActive(Boolean isActive);
    Page<EmergencyContact> findByIsActive(Boolean isActive, Pageable pageable);
    
    @Query("SELECT ec FROM EmergencyContact ec WHERE ec.location.id = :locationId AND ec.department = :department")
    List<EmergencyContact> findByLocationAndDepartment(@Param("locationId") UUID locationId, @Param("department") String department);
    
    Page<EmergencyContact> findAll(Pageable pageable);
}
