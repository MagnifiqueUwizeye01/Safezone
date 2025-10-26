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
            return "saved successfully";
        } else {
            return "exists";
        }
    }
    
    public String saveChild(String parentCode, Location location) {
        if (parentCode != null) {
            Optional<Location> getParent = locationRepository.findByCode(parentCode);
            
            if (getParent.isPresent()) {
                //bind the parent to child
                location.setParent(getParent.get());
                
                if (!locationRepository.existsByCode(location.getCode())) {
                    locationRepository.save(location);
                    return "child is saved successfully";
                } else {
                    return "child with this code exists";
                }
            } else {
                return "The parent with this code does not exist";
            }
        } else {
            if (!locationRepository.existsByCode(location.getCode())) {
                locationRepository.save(location);
                return "parent is saved successfully";
            } else {
                return "parent exists";
            }
        }
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
