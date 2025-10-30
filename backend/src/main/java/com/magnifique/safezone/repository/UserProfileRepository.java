package com.magnifique.safezone.repository;

import com.magnifique.safezone.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
    
    Optional<UserProfile> findByUserId(UUID userId);
    
    Boolean existsByUserId(UUID userId);
}

