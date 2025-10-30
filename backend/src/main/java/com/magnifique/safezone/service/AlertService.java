package com.magnifique.safezone.service;

import com.magnifique.safezone.enums.EAlertType;
import com.magnifique.safezone.model.Alert;
import com.magnifique.safezone.model.Location;
import com.magnifique.safezone.model.User;
import com.magnifique.safezone.repository.AlertRepository;
import com.magnifique.safezone.repository.LocationRepository;
import com.magnifique.safezone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class AlertService {
    
    @Autowired
    private AlertRepository alertRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LocationRepository locationRepository;
    
    public Alert saveAlert(Alert alert) {
        // Load Location entity
        if (alert.getLocation() != null && alert.getLocation().getId() != null) {
            Optional<Location> locOpt = locationRepository.findById(alert.getLocation().getId());
            locOpt.ifPresent(alert::setLocation);
        }

        // If no manual recipients provided but location is set, auto-assign users from that
        // location and all of its descendants (village/cell/sector/district/province aware)
        if ((alert.getRecipients() == null || alert.getRecipients().isEmpty()) && alert.getLocation() != null) {
            Set<UUID> targetLocationIds = new HashSet<>();
            // BFS over hierarchy
            List<Location> queue = new java.util.ArrayList<>();
            queue.add(alert.getLocation());
            int idx = 0;
            while (idx < queue.size()) {
                Location current = queue.get(idx++);
                targetLocationIds.add(current.getId());
                // fetch children
                List<Location> children = locationRepository.findByParent(current);
                if (children != null && !children.isEmpty()) {
                    queue.addAll(children);
                }
            }
            // Resolve users
            Set<User> usersInRegion = new HashSet<>(
                    userRepository.findByLocation_IdIn(new java.util.ArrayList<>(targetLocationIds))
            );
            alert.setRecipients(usersInRegion);
        } else if (alert.getRecipients() != null && !alert.getRecipients().isEmpty()) {
            // Load User entities for manual recipients
            Set<User> loadedRecipients = new HashSet<>();
            for (User user : alert.getRecipients()) {
                if (user.getId() != null) {
                    Optional<User> loadedUser = userRepository.findById(user.getId());
                    loadedUser.ifPresent(loadedRecipients::add);
                }
            }
            alert.setRecipients(loadedRecipients);
        }

        return alertRepository.save(alert);
    }
    
    public List<Alert> getAllAlert() {
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
    
    public Page<Alert> getAlertsByType(EAlertType alertType, Pageable pageable) {
        return alertRepository.findByAlertType(alertType, pageable);
    }
}
