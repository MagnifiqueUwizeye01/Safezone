package com.magnifique.safezone.controller;

import com.magnifique.safezone.enums.EReportStatus;
import com.magnifique.safezone.model.Report;
import com.magnifique.safezone.service.ReportService;
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
@RequestMapping(value = "/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<String> createReport(@RequestBody Report report) {
        reportService.saveReport(report);
        return new ResponseEntity<>("Report sent successfully", HttpStatus.CREATED);
    }

    @GetMapping(value = "/all")
    public ResponseEntity<?> getAllReport() {
        return new ResponseEntity<>(reportService.getAllReport(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable UUID id) {
        Optional<Report> reportOpt = reportService.getReportById(id);
        if (reportOpt.isPresent()) {
            return new ResponseEntity<>(reportOpt.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Report not found", HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateReport(@PathVariable UUID id, @RequestBody Report report) {
        String result = reportService.updateReport(id, report);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReport(@PathVariable UUID id) {
        String result = reportService.deleteReport(id);
        if (result.contains("successfully")) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }

    @GetMapping("/status/{status}")
    public List<Report> getReportsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        EReportStatus reportStatus = EReportStatus.valueOf(status.toUpperCase());
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        return reportService.getReportsByStatus(reportStatus, sort);
    }

    @GetMapping("/status/{status}/paginated")
    public Page<Report> getReportsByStatusPaginated(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        EReportStatus reportStatus = EReportStatus.valueOf(status.toUpperCase());
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return reportService.getReportsByStatus(reportStatus, pageable);
    }
}
