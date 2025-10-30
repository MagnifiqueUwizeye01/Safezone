package com.magnifique.safezone.controller;

import com.magnifique.safezone.model.UserProfile;
import com.magnifique.safezone.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(value = "/user-profile")
public class UserProfileController {
    
    @Autowired
    private UserProfileService userProfileService;
    
    @PostMapping(value = "/create")
    public ResponseEntity<?> createUserProfile(@RequestBody UserProfile userProfile) {
        String result = userProfileService.saveUserProfile(userProfile);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result, HttpStatus.CONFLICT);
    }
    
    @GetMapping(value = "/all")
    public ResponseEntity<?> getAllUserProfiles() {
        return new ResponseEntity<>(userProfileService.getAllUserProfiles(), HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfileById(@PathVariable UUID id) {
        Optional<UserProfile> profileOpt = userProfileService.getUserProfileById(id);
        if (profileOpt.isPresent()) {
            return new ResponseEntity<>(profileOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("User profile not found", HttpStatus.NOT_FOUND);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserProfileByUserId(@PathVariable UUID userId) {
        Optional<UserProfile> profileOpt = userProfileService.getUserProfileByUserId(userId);
        if (profileOpt.isPresent()) {
            return new ResponseEntity<>(profileOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("No profile found for this user", HttpStatus.NOT_FOUND);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable UUID id, @RequestBody UserProfile userProfile) {
        String result = userProfileService.updateUserProfile(id, userProfile);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserProfile(@PathVariable UUID id) {
        String result = userProfileService.deleteUserProfile(id);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }
}

