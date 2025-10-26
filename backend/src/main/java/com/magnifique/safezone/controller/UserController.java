package com.magnifique.safezone.controller;

import com.magnifique.safezone.model.User;
import com.magnifique.safezone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // CREATE
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        String result = userService.saveUser(user);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result, HttpStatus.CONFLICT);
    }

    // READ - Get all
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // READ - Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            return new ResponseEntity<>(userOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable UUID id, @RequestBody User user) {
        String result = userService.updateUser(id, user);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        String result = userService.deleteUser(id);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    // Get users by role (with sorting)
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        return userService.getUsersByRole(role);
    }

    // Get users by role (with pagination)
    @GetMapping("/role/{role}/paginated")
    public Page<User> getUsersByRolePaginated(
            @PathVariable String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.getUsersByRole(role, pageable);
    }

    // Get users by province code
    @GetMapping("/province/code/{code}")
    public List<User> getUsersByProvinceCode(@PathVariable String code) {
        return userService.getUsersByProvinceCode(code);
    }

    // Get users by province name
    @GetMapping("/province/name/{name}")
    public List<User> getUsersByProvinceName(@PathVariable String name) {
        return userService.getUsersByProvinceName(name);
    }
}
