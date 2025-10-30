package com.magnifique.safezone.service;

import com.magnifique.safezone.model.UserProfile;
import com.magnifique.safezone.model.User;
import com.magnifique.safezone.repository.UserProfileRepository;
import com.magnifique.safezone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserProfileService {
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public String saveUserProfile(UserProfile userProfile) {
        if (userProfile.getUser() == null || userProfile.getUser().getId() == null) {
            return "User ID is required";
        }
        
        UUID userId = userProfile.getUser().getId();
        
        if (!userRepository.existsById(userId)) {
            return "User not found";
        }
        
        if (userProfileRepository.existsByUserId(userId)) {
            return "User already has a profile";
        }
        
        User user = userRepository.findById(userId).get();
        userProfile.setUser(user);
        
        try {
            userProfileRepository.save(userProfile);
            return "User profile saved successfully";
        } catch (Exception e) {
            return "Error saving user profile: " + e.getMessage();
        }
    }
    
    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }
    
    public Optional<UserProfile> getUserProfileById(UUID id) {
        return userProfileRepository.findById(id);
    }
    
    public Optional<UserProfile> getUserProfileByUserId(UUID userId) {
        return userProfileRepository.findByUserId(userId);
    }
    
    public String updateUserProfile(UUID id, UserProfile userProfile) {
        Optional<UserProfile> existingProfile = userProfileRepository.findById(id);
        if (existingProfile.isPresent()) {
            if (userProfile.getUser() != null && userProfile.getUser().getId() != null) {
                UUID userId = userProfile.getUser().getId();
                if (!userRepository.existsById(userId)) {
                    return "User not found";
                }
                User user = userRepository.findById(userId).get();
                userProfile.setUser(user);
            } else {
                userProfile.setUser(existingProfile.get().getUser());
            }
            
            userProfile.setId(id);
            try {
                userProfileRepository.save(userProfile);
                return "User profile updated successfully";
            } catch (Exception e) {
                return "Error updating user profile: " + e.getMessage();
            }
        }
        return "User profile not found";
    }
    
    public String deleteUserProfile(UUID id) {
        if (userProfileRepository.existsById(id)) {
            try {
                userProfileRepository.deleteById(id);
                return "User profile deleted successfully";
            } catch (Exception e) {
                return "Cannot delete user profile: " + e.getMessage();
            }
        }
        return "User profile not found";
    }
}

