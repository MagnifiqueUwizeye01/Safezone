package com.magnifique.safezone.controller;

import com.magnifique.safezone.enums.EAlertType;
import com.magnifique.safezone.model.Alert;
import com.magnifique.safezone.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(value = "/alert")
public class AlertController {

    @Autowired
    private AlertService alertService;

    // CREATE
    @PostMapping
    public ResponseEntity<String> createAlert(@RequestBody Alert alert) {
        alertService.saveAlert(alert);
        return new ResponseEntity<>("Alert sent successfully", HttpStatus.CREATED);
    }

    // READ - Get all
    @GetMapping(value = "/all")
    public ResponseEntity<?> getAllAlert() {
        return new ResponseEntity<>(alertService.getAllAlert(), HttpStatus.OK);
    }

    // READ - Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAlertById(@PathVariable UUID id) {
        Optional<Alert> alertOpt = alertService.getAlertById(id);
        if (alertOpt.isPresent()) {
            return new ResponseEntity<>(alertOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Alert not found", HttpStatus.NOT_FOUND);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<String> updateAlert(@PathVariable UUID id, @RequestBody Alert alert) {
        String result = alertService.updateAlert(id, alert);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAlert(@PathVariable UUID id) {
        String result = alertService.deleteAlert(id);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    // Get by type with pagination
    @GetMapping("/type/{type}/paginated")
    public Page<Alert> getAlertsByTypePaginated(
            @PathVariable String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        EAlertType alertType = EAlertType.valueOf(type.toUpperCase());
        Pageable pageable = PageRequest.of(page, size);
        return alertService.getAlertsByType(alertType, pageable);
    }
}
