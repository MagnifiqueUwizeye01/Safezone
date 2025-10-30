package com.magnifique.safezone.repository;

import com.magnifique.safezone.enums.EUserRole;
import com.magnifique.safezone.model.User;
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
public interface UserRepository extends JpaRepository<User, UUID> {
    
    // existsBy... methods
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    
    // findBy... methods
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    // Find by role with sorting
    List<User> findByRole(EUserRole role, Sort sort);
    
    // Find by role with pagination
    Page<User> findByRole(EUserRole role, Pageable pageable);
    
    // Find users by location (province code)
    @Query("SELECT u FROM User u WHERE u.location.code = :provinceCode")
    List<User> findByProvinceCode(@Param("provinceCode") String provinceCode);
    
    // Find users by location (province name)
    @Query("SELECT u FROM User u WHERE u.location.name = :provinceName")
    List<User> findByProvinceName(@Param("provinceName") String provinceName);
    
    // Find user's province by user ID
    @Query("SELECT u.location.parent.parent.parent.parent FROM User u WHERE u.id = :userId")
    Optional<?> findProvinceByUserId(@Param("userId") UUID userId);
    
    // Find users by location ID
    @Query("SELECT u FROM User u WHERE u.location.id = :locationId")
    List<User> findByLocationId(@Param("locationId") UUID locationId);

    // Find users by a list of location IDs (for region hierarchy)
    List<User> findByLocation_IdIn(List<UUID> locationIds);
}
