package com.magnifique.safezone.service;

import com.magnifique.safezone.enums.EUserRole;
import com.magnifique.safezone.model.User;
import com.magnifique.safezone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public String saveUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists";
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists";
        }
        userRepository.save(user);
        return "User saved successfully";
    }
    
    public List<User> getAllUser() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }
    
    public String updateUser(UUID id, User user) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            user.setId(id);
            userRepository.save(user);
            return "User updated successfully";
        }
        return "User not found";
    }
    
    public String deleteUser(UUID id) {
        if (userRepository.existsById(id)) {
            try {
                userRepository.deleteById(id);
                return "User deleted successfully";
            } catch (Exception e) {
                return "Cannot delete user: " + e.getMessage();
            }
        }
        return "User not found";
    }
    
    public List<User> getUsersByRole(EUserRole role) {
        return userRepository.findByRole(role, Sort.by("username"));
    }
    
    public Page<User> getUsersByRole(EUserRole role, Pageable pageable) {
        return userRepository.findByRole(role, pageable);
    }
    
    public List<User> getUsersByProvinceCode(String provinceCode) {
        return userRepository.findByProvinceCode(provinceCode);
    }
    
    public List<User> getUsersByProvinceName(String provinceName) {
        return userRepository.findByProvinceName(provinceName);
    }
}
