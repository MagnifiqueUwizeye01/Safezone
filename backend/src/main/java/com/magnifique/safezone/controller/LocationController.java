package com.magnifique.safezone.controller;

import com.magnifique.safezone.model.Location;
import com.magnifique.safezone.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    // CREATE - Save parent (province)
    @PostMapping("/parent")
    public ResponseEntity<String> saveParent(@RequestBody Location location) {
        String result = locationService.saveParent(location);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result, HttpStatus.CONFLICT);
    }

    // CREATE - Save child (district, sector, cell, village)
    @PostMapping("/child")
    public ResponseEntity<String> saveChild(
            @RequestParam String parentCode,
            @RequestBody Location location) {
        String result = locationService.saveChild(parentCode, location);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
    }

    // READ - Get all provinces
    @GetMapping("/provinces")
    public List<Location> getAllProvinces() {
        return locationService.getAllProvinces();
    }

    // READ - Get location by code
    @GetMapping("/code/{code}")
    public ResponseEntity<?> getLocationByCode(@PathVariable String code) {
        Optional<Location> locationOpt = locationService.getLocationByCode(code);
        if (locationOpt.isPresent()) {
            return new ResponseEntity<>(locationOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Location not found", HttpStatus.NOT_FOUND);
    }

    // READ - Get children by parent code
    @GetMapping("/parent/{parentCode}")
    public List<Location> getChildrenByParentCode(@PathVariable String parentCode) {
        return locationService.getChildrenByParentCode(parentCode);
    }
}
