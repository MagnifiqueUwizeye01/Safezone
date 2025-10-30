package com.magnifique.safezone.service;

import com.magnifique.safezone.model.EmergencyContact;
import com.magnifique.safezone.model.Location;
import com.magnifique.safezone.repository.EmergencyContactRepository;
import com.magnifique.safezone.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmergencyContactService {
    
    @Autowired
    private EmergencyContactRepository emergencyContactRepository;
    
    @Autowired
    private LocationRepository locationRepository;
    
    public String saveEmergencyContact(EmergencyContact emergencyContact) {
        if (emergencyContactRepository.existsByPhone(emergencyContact.getPhone())) {
            return "Phone number already exists";
        }
        if (emergencyContactRepository.existsByEmail(emergencyContact.getEmail())) {
            return "Email already exists";
        }
        
        // Load Location entity
        if (emergencyContact.getLocation() != null && emergencyContact.getLocation().getId() != null) {
            Optional<Location> location = locationRepository.findById(emergencyContact.getLocation().getId());
            location.ifPresent(emergencyContact::setLocation);
        }
        
        emergencyContactRepository.save(emergencyContact);
        return "Emergency contact saved successfully";
    }
    
    public List<EmergencyContact> getAllEmergencyContact() {
        return emergencyContactRepository.findAll();
    }
    
    public Optional<EmergencyContact> getEmergencyContactById(UUID id) {
        return emergencyContactRepository.findById(id);
    }
    
    public String updateEmergencyContact(UUID id, EmergencyContact emergencyContact) {
        Optional<EmergencyContact> existingContact = emergencyContactRepository.findById(id);
        if (existingContact.isPresent()) {
            emergencyContact.setId(id);
            emergencyContactRepository.save(emergencyContact);
            return "Emergency contact updated successfully";
        }
        return "Emergency contact not found";
    }
    
    public String deleteEmergencyContact(UUID id) {
        if (emergencyContactRepository.existsById(id)) {
            emergencyContactRepository.deleteById(id);
            return "Emergency contact deleted successfully";
        }
        return "Emergency contact not found";
    }
    
    // Get emergency contacts by department
    public List<EmergencyContact> getEmergencyContactsByDepartment(String department) {
        return emergencyContactRepository.findByDepartment(department, Sort.by("name"));
    }
    
    // Get emergency contacts by department with pagination
    public Page<EmergencyContact> getEmergencyContactsByDepartment(String department, Pageable pageable) {
        return emergencyContactRepository.findByDepartment(department, pageable);
    }
    
    // Get emergency contacts by location
    public List<EmergencyContact> getEmergencyContactsByLocation(UUID locationId) {
        return emergencyContactRepository.findByLocationId(locationId);
    }
    
    // Get active emergency contacts
    public List<EmergencyContact> getActiveEmergencyContacts() {
        return emergencyContactRepository.findByIsActive(true);
    }
    
    // Get active emergency contacts with pagination
    public Page<EmergencyContact> getActiveEmergencyContacts(Pageable pageable) {
        return emergencyContactRepository.findByIsActive(true, pageable);
    }
    
    // Get emergency contacts by location and department
    public List<EmergencyContact> getEmergencyContactsByLocationAndDepartment(UUID locationId, String department) {
        return emergencyContactRepository.findByLocationAndDepartment(locationId, department);
    }
}
