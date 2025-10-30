package com.magnifique.safezone.controller;

import com.magnifique.safezone.enums.EReportStatus;
import com.magnifique.safezone.model.Report;
import com.magnifique.safezone.service.ReportService;
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
@RequestMapping(value = "/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // CREATE
    @PostMapping
    public ResponseEntity<String> createReport(@RequestBody Report report) {
        reportService.saveReport(report);
        return new ResponseEntity<>("Report sent successfully", HttpStatus.CREATED);
    }

    // READ - Get all
    @GetMapping(value = "/all")
    public ResponseEntity<?> getAllReport() {
        return new ResponseEntity<>(reportService.getAllReport(), HttpStatus.OK);
    }

    // READ - Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable UUID id) {
        Optional<Report> reportOpt = reportService.getReportById(id);
        if (reportOpt.isPresent()) {
            return new ResponseEntity<>(reportOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Report not found", HttpStatus.NOT_FOUND);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<String> updateReport(@PathVariable UUID id, @RequestBody Report report) {
        String result = reportService.updateReport(id, report);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReport(@PathVariable UUID id) {
        String result = reportService.deleteReport(id);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    // Get by status with pagination
    @GetMapping("/status/{status}/paginated")
    public Page<Report> getReportsByStatusPaginated(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        EReportStatus reportStatus = EReportStatus.valueOf(status.toUpperCase());
        Pageable pageable = PageRequest.of(page, size);
        return reportService.getReportsByStatus(reportStatus, pageable);
    }
}
