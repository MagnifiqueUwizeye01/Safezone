package com.magnifique.safezone.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.magnifique.safezone.model.Location;
import com.magnifique.safezone.service.LocationService;

@RestController
@RequestMapping(value = "/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping(value = "/parent", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveParent(@RequestBody Location location) {
        String response = locationService.saveParent(location);
        if (response.equals("saved successfully")) {
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
    }

    @PostMapping(value = "/child", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveChild(@RequestParam String parentCode, @RequestBody Location location) {
        String response = locationService.saveChild(parentCode, location);
        if (response.equals("child is saved successfully")) {
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } else if (response.equals("child with this code exists")) {
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        } else if (response.equals("The parent with this code does not exist")) {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
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
