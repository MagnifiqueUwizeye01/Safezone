package com.magnifique.safezone.controller;

import com.magnifique.safezone.service.*;
import com.magnifique.safezone.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(value = "/emergency-contact")
public class EmergencyContactController {

    @Autowired
    private EmergencyContactService emergencyContactService;

    @PostMapping(value = "/create")
    public ResponseEntity<?> createEmergencyContact(@RequestBody EmergencyContact emergencyContact) {
        String result = emergencyContactService.saveEmergencyContact(emergencyContact);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result, HttpStatus.CONFLICT);
    }

    @GetMapping(value = "/all")
    public ResponseEntity<?> getAllEmergencyContact() {
        return new ResponseEntity<>(emergencyContactService.getAllEmergencyContact(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmergencyContactById(@PathVariable UUID id) {
        Optional<EmergencyContact> contactOpt = emergencyContactService.getEmergencyContactById(id);
        if (contactOpt.isPresent()) {
            return new ResponseEntity<>(contactOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Emergency contact not found", HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmergencyContact(@PathVariable UUID id, @RequestBody EmergencyContact emergencyContact) {
        String result = emergencyContactService.updateEmergencyContact(id, emergencyContact);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmergencyContact(@PathVariable UUID id) {
        String result = emergencyContactService.deleteEmergencyContact(id);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    @GetMapping("/department/{department}")
    public List<EmergencyContact> getEmergencyContactsByDepartment(
            @PathVariable String department,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        return emergencyContactService.getEmergencyContactsByDepartment(department, sort);
    }

    @GetMapping("/department/{department}/paginated")
    public Page<EmergencyContact> getEmergencyContactsByDepartmentPaginated(
            @PathVariable String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return emergencyContactService.getEmergencyContactsByDepartment(department, pageable);
    }

    @GetMapping("/location/{locationId}")
    public List<EmergencyContact> getEmergencyContactsByLocation(@PathVariable UUID locationId) {
        return emergencyContactService.getEmergencyContactsByLocation(locationId);
    }

    @GetMapping("/active")
    public List<EmergencyContact> getActiveEmergencyContacts() {
        return emergencyContactService.getActiveEmergencyContacts();
    }

    @GetMapping("/active/paginated")
    public Page<EmergencyContact> getActiveEmergencyContactsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return emergencyContactService.getActiveEmergencyContacts(pageable);
    }

    @GetMapping("/location/{locationId}/department/{department}")
    public List<EmergencyContact> getEmergencyContactsByLocationAndDepartment(
            @PathVariable UUID locationId, 
            @PathVariable String department) {
        return emergencyContactService.getEmergencyContactsByLocationAndDepartment(locationId, department);
    }
}
