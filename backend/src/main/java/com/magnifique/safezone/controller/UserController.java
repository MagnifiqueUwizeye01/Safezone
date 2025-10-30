package com.magnifique.safezone.controller;

import com.magnifique.safezone.service.UserService;
import com.magnifique.safezone.model.User;
import com.magnifique.safezone.enums.EUserRole;

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
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private UserService userService;

    // CREATE
    @PostMapping(value = "/create")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        String result = userService.saveUser(user);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result, HttpStatus.CONFLICT);
    }

    // READ
    @GetMapping(value = "/all")
    public ResponseEntity<?> getAllUser() {
        return new ResponseEntity<>(userService.getAllUser(), HttpStatus.OK);
    }

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
    public List<User> getUsersByRole(
            @PathVariable String role,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        EUserRole userRole = EUserRole.valueOf(role.toUpperCase());
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        return userService.getUsersByRole(userRole, sort);
    }

    // Get users by role (with pagination and sorting)
    @GetMapping("/role/{role}/paginated")
    public Page<User> getUsersByRolePaginated(
            @PathVariable String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        EUserRole userRole = EUserRole.valueOf(role.toUpperCase());
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return userService.getUsersByRole(userRole, pageable);
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

    // Get users by location ID
    @GetMapping("/location/{locationId}")
    public ResponseEntity<?> getUsersByLocationId(@PathVariable UUID locationId) {
        List<User> users = userService.getUsersByLocationId(locationId);
        if (users.isEmpty()) {
            return new ResponseEntity<>("No users found in that location", HttpStatus.OK);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
}
