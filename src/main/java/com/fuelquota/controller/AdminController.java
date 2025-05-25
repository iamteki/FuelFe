package com.fuelquota.controller;

import com.fuelquota.dto.response.ApiResponse;
import com.fuelquota.dto.response.DashboardStatsResponse;
import com.fuelquota.dto.response.FuelStationResponse;
import com.fuelquota.entity.FuelStation;
import com.fuelquota.security.CustomUserDetails;
import com.fuelquota.service.AdminService;
import com.fuelquota.service.FuelStationService;
import com.fuelquota.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final FuelStationService fuelStationService;
    private final ReportService reportService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/fuel-stations/pending")
    public ResponseEntity<ApiResponse<List<FuelStationResponse>>> getPendingFuelStations() {
        List<FuelStationResponse> stations = fuelStationService.getPendingApprovalStations();
        return ResponseEntity.ok(ApiResponse.success(stations));
    }

    @GetMapping("/fuel-stations/pending/page")
    public ResponseEntity<ApiResponse<Page<FuelStationResponse>>> getPendingFuelStationsPaginated(Pageable pageable) {
        Page<FuelStationResponse> stations = fuelStationService.getPendingApprovalStations(pageable);
        return ResponseEntity.ok(ApiResponse.success(stations));
    }

    @PostMapping("/fuel-stations/{id}/approve")
    public ResponseEntity<ApiResponse<FuelStation>> approveFuelStation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id) {
        FuelStation station = fuelStationService.approveFuelStation(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Fuel station approved successfully", station));
    }

    @PostMapping("/fuel-stations/{id}/reject")
    public ResponseEntity<ApiResponse<FuelStation>> rejectFuelStation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id) {
        FuelStation station = fuelStationService.rejectFuelStation(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Fuel station rejected", station));
    }

    @GetMapping("/reports/transactions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTransactionReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> report = reportService.generateTransactionReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/reports/fuel-consumption")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFuelConsumptionReport(
            @RequestParam(required = false) String period) {
        Map<String, Object> report = reportService.generateFuelConsumptionReport(period);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<Object>>> getAllUsers(Pageable pageable) {
        Page<Object> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse<?>> activateUser(@PathVariable Long id) {
        adminService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User activated successfully", null));
    }

    @PostMapping("/users/{id}/deactivate")
    public ResponseEntity<ApiResponse<?>> deactivateUser(@PathVariable Long id) {
        adminService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully", null));
    }
}