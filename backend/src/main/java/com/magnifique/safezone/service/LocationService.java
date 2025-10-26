package com.magnifique.safezone.service;

import com.magnifique.safezone.model.Location;
import com.magnifique.safezone.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {
    
    @Autowired
    private LocationRepository locationRepository;
    
    public String saveParent(Location location) {
        if (!locationRepository.existsByCode(location.getCode())) {
            locationRepository.save(location);
            return "Parent saved successfully";
        }
        return "Location with this code already exists";
    }
    
    public String saveChild(String parentCode, Location location) {
        if (parentCode != null) {
            Optional<Location> parent = locationRepository.findByCode(parentCode);
            
            if (parent.isPresent()) {
                location.setParent(parent.get());
                
                if (!locationRepository.existsByCode(location.getCode())) {
                    locationRepository.save(location);
                    return "Child saved successfully";
                }
                return "Child with this code already exists";
            }
            return "Parent with this code does not exist";
        }
        return saveParent(location);
    }
    
    public Optional<Location> getLocationByCode(String code) {
        return locationRepository.findByCode(code);
    }
    
    public List<Location> getAllProvinces() {
        return locationRepository.findAllProvinces();
    }
    
    public List<Location> getChildrenByParentCode(String parentCode) {
        return locationRepository.findByParentCode(parentCode);
    }
}
