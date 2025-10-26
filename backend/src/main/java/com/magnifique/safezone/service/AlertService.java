package com.magnifique.safezone.service;

import com.magnifique.safezone.model.Alert;
import com.magnifique.safezone.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AlertService {
    
    @Autowired
    private AlertRepository alertRepository;
    
    public Alert saveAlert(Alert alert) {
        return alertRepository.save(alert);
    }
    
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }
    
    public Optional<Alert> getAlertById(UUID id) {
        return alertRepository.findById(id);
    }
    
    public String updateAlert(UUID id, Alert alert) {
        Optional<Alert> existingAlert = alertRepository.findById(id);
        if (existingAlert.isPresent()) {
            alert.setId(id);
            alertRepository.save(alert);
            return "Alert updated successfully";
        }
        return "Alert not found";
    }
    
    public String deleteAlert(UUID id) {
        if (alertRepository.existsById(id)) {
            alertRepository.deleteById(id);
            return "Alert deleted successfully";
        }
        return "Alert not found";
    }
    
    public Page<Alert> getAlertsByType(String alertType, Pageable pageable) {
        return alertRepository.findByAlertType(alertType, pageable);
    }
}
