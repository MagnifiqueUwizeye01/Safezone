package com.magnifique.safezone.repository;

import com.magnifique.safezone.model.Location;
import com.magnifique.safezone.model.ELocationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocationRepository extends JpaRepository<Location, UUID> {
    
    // existsBy... method
    Boolean existsByCode(String code);
    
    // findBy... methods
    Optional<Location> findByCode(String code);
    
    Optional<Location> findByName(String name);
    
    // Find by type
    Optional<Location> findByType(ELocationType type);
    
    // Find all provinces
    @Query("SELECT l FROM Location l WHERE l.type = 'PROVINCE'")
    java.util.List<Location> findAllProvinces();
    
    // Find children by parent code
    @Query("SELECT l FROM Location l WHERE l.parent.code = :parentCode")
    java.util.List<Location> findByParentCode(@Param("parentCode") String parentCode);
}
