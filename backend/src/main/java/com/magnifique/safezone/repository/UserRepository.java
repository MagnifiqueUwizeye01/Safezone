package com.magnifique.safezone.repository;

import com.magnifique.safezone.enums.EUserRole;
import com.magnifique.safezone.model.Location;
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
    
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(EUserRole role, Sort sort);
    Page<User> findByRole(EUserRole role, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE " +
           "(u.location.type = 'PROVINCE' AND u.location.code = :provinceCode) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.type = 'PROVINCE' AND u.location.parent.code = :provinceCode) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.type = 'PROVINCE' AND u.location.parent.parent.code = :provinceCode) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.type = 'PROVINCE' AND u.location.parent.parent.parent.code = :provinceCode) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.parent.type = 'PROVINCE' AND u.location.parent.parent.parent.parent.code = :provinceCode)")
    List<User> findByProvinceCode(@Param("provinceCode") String provinceCode);
    
    @Query("SELECT u FROM User u WHERE " +
           "(u.location.type = 'PROVINCE' AND u.location.name = :provinceName) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.type = 'PROVINCE' AND u.location.parent.name = :provinceName) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.type = 'PROVINCE' AND u.location.parent.parent.name = :provinceName) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.type = 'PROVINCE' AND u.location.parent.parent.parent.name = :provinceName) OR " +
           "(u.location.parent IS NOT NULL AND u.location.parent.parent IS NOT NULL AND u.location.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.parent IS NOT NULL AND u.location.parent.parent.parent.parent.type = 'PROVINCE' AND u.location.parent.parent.parent.parent.name = :provinceName)")
    List<User> findByProvinceName(@Param("provinceName") String provinceName);
    
    @Query("SELECT CASE " +
           "WHEN u.location.type = 'PROVINCE' THEN u.location " +
           "WHEN u.location.parent.type = 'PROVINCE' THEN u.location.parent " +
           "WHEN u.location.parent.parent.type = 'PROVINCE' THEN u.location.parent.parent " +
           "WHEN u.location.parent.parent.parent.type = 'PROVINCE' THEN u.location.parent.parent.parent " +
           "WHEN u.location.parent.parent.parent.parent.type = 'PROVINCE' THEN u.location.parent.parent.parent.parent " +
           "ELSE NULL END FROM User u WHERE u.id = :userId")
    Optional<Location> findProvinceByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT u FROM User u WHERE u.location.id = :locationId")
    List<User> findByLocationId(@Param("locationId") UUID locationId);

    @Query("SELECT u FROM User u WHERE u.location.id = :locationId")
    Page<User> findByLocationId(@Param("locationId") UUID locationId, Pageable pageable);

    List<User> findByLocation_IdIn(List<UUID> locationIds);
}
