package com.fuelquota.controller;

import com.fuelquota.dto.response.ApiResponse;
import com.fuelquota.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'FUEL_STATION_OWNER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTransactionReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> report = reportService.generateTransactionReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/fuel-consumption")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFuelConsumptionReport(
            @RequestParam(required = false, defaultValue = "month") String period) {
        Map<String, Object> report = reportService.generateFuelConsumptionReport(period);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/station-performance/{stationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FUEL_STATION_OWNER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStationPerformanceReport(
            @PathVariable Long stationId) {
        Map<String, Object> report = reportService.generateStationPerformanceReport(stationId);
        return ResponseEntity.ok(ApiResponse.success(report));
    }
}