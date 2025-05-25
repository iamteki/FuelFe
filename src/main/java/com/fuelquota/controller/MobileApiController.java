package com.fuelquota.controller;

import com.fuelquota.dto.request.FuelPumpingRequest;
import com.fuelquota.dto.request.LoginRequest;
import com.fuelquota.dto.response.*;
import com.fuelquota.entity.FuelStationOperator;
import com.fuelquota.entity.FuelTransaction;
import com.fuelquota.security.CustomUserDetails;
import com.fuelquota.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Mobile API Controller specifically designed for the Android mobile app
 * Used by fuel station operators to scan QR codes and pump fuel
 */
@Slf4j
@RestController
@RequestMapping("/mobile/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class MobileApiController {

    private final AuthService authService;
    private final TransactionService transactionService;
    private final FuelStationOperatorService operatorService;
    private final VehicleService vehicleService;
    private final QuotaService quotaService;

    /**
     * Mobile operator login endpoint
     */
    @PostMapping("/auth/login")
    public ResponseEntity<?> mobileLogin(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Mobile login attempt for user: {}", loginRequest.getUsernameOrEmail());
        
        try {
            LoginResponse loginResponse = authService.authenticateUser(loginRequest);
            
            // Verify user is a fuel station operator
            if (loginResponse.getRole() != com.fuelquota.entity.enums.UserRole.FUEL_STATION_OPERATOR) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied. Only fuel station operators can use the mobile app"));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid credentials"));
        }
    }

    /**
     * Scan QR code and get vehicle details with quota information
     */
    @PostMapping("/scan-qr")
    @PreAuthorize("hasRole('FUEL_STATION_OPERATOR')")
    public ResponseEntity<?> scanQRCode(
            @RequestParam String qrCode,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        log.info("QR code scanned by operator {}: {}", currentUser.getUsername(), qrCode);
        
        try {
            VehicleResponse vehicle = transactionService.scanQRCode(qrCode);
            
            // Build mobile-friendly response
            MobileVehicleResponse response = MobileVehicleResponse.builder()
                    .vehicleId(vehicle.getId())
                    .vehicleNumber(vehicle.getVehicleNumber())
                    .vehicleType(vehicle.getVehicleType().toString())
                    .fuelType(vehicle.getFuelType().toString())
                    .ownerName(vehicle.getOwnerName())
                    .currentQuota(vehicle.getCurrentQuota())
                    .isVerified(vehicle.getIsVerified())
                    .canPumpFuel(vehicle.getCurrentQuota() != null && 
                                vehicle.getCurrentQuota().getRemainingQuota().doubleValue() > 0)
                    .build();
            
            return ResponseEntity.ok(ApiResponse.success("Vehicle details retrieved", response));
            
        } catch (Exception e) {
            log.error("Error scanning QR code: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid QR code or vehicle not found"));
        }
    }

    /**
     * Get vehicle quota details
     */
    @GetMapping("/vehicle/{vehicleId}/quota")
    @PreAuthorize("hasRole('FUEL_STATION_OPERATOR')")
    public ResponseEntity<ApiResponse<QuotaResponse>> getVehicleQuota(@PathVariable Long vehicleId) {
        QuotaResponse quota = quotaService.getCurrentQuotaResponse(vehicleId);
        return ResponseEntity.ok(ApiResponse.success(quota));
    }

    /**
     * Pump fuel - main transaction endpoint for mobile
     */
    @PostMapping("/pump-fuel")
    @PreAuthorize("hasRole('FUEL_STATION_OPERATOR')")
    public ResponseEntity<?> pumpFuel(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody FuelPumpingRequest request) {
        
        log.info("Fuel pumping request from operator {}: {} liters for vehicle ID {}", 
                currentUser.getUsername(), request.getPumpedLiters(), request.getVehicleId());
        
        try {
            FuelStationOperator operator = operatorService.getOperatorByUserId(currentUser.getId());
            FuelTransaction transaction = transactionService.pumpFuel(operator.getId(), request);
            
            // Build mobile-friendly response
            MobileTransactionResponse response = MobileTransactionResponse.builder()
                    .transactionId(transaction.getId())
                    .vehicleNumber(transaction.getVehicle().getVehicleNumber())
                    .pumpedLiters(transaction.getPumpedLiters())
                    .totalAmount(transaction.getTotalAmount())
                    .remainingQuota(transaction.getFuelQuota().getRemainingQuota())
                    .transactionDate(transaction.getTransactionDate())
                    .smsSent(transaction.getSmsSent())
                    .message("Fuel pumped successfully. SMS notification " + 
                            (transaction.getSmsSent() ? "sent" : "pending"))
                    .build();
            
            return ResponseEntity.ok(ApiResponse.success("Transaction completed", response));
            
        } catch (Exception e) {
            log.error("Error pumping fuel: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get operator profile and fuel station details
     */
    @GetMapping("/operator/profile")
    @PreAuthorize("hasRole('FUEL_STATION_OPERATOR')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOperatorProfile(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        FuelStationOperator operator = operatorService.getOperatorByUserId(currentUser.getId());
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("operatorId", operator.getId());
        profile.put("operatorName", operator.getFullName());
        profile.put("employeeId", operator.getEmployeeId());
        profile.put("fuelStationName", operator.getFuelStation().getStationName());
        profile.put("fuelStationAddress", operator.getFuelStation().getAddress());
        profile.put("isActive", operator.getIsActive());
        
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    /**
     * Get today's transactions for the operator
     */
    @GetMapping("/operator/transactions/today")
    @PreAuthorize("hasRole('FUEL_STATION_OPERATOR')")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTodaysTransactions(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        FuelStationOperator operator = operatorService.getOperatorByUserId(currentUser.getId());
        List<TransactionResponse> transactions = transactionService.getTransactionsByOperator(operator.getId());
        
        // Filter today's transactions
        List<TransactionResponse> todaysTransactions = transactions.stream()
                .filter(t -> t.getTransactionDate().toLocalDate()
                        .equals(java.time.LocalDate.now()))
                .toList();
        
        return ResponseEntity.ok(ApiResponse.success(todaysTransactions));
    }

    /**
     * Get operator statistics
     */
    @GetMapping("/operator/stats")
    @PreAuthorize("hasRole('FUEL_STATION_OPERATOR')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOperatorStats(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        FuelStationOperator operator = operatorService.getOperatorByUserId(currentUser.getId());
        List<TransactionResponse> transactions = transactionService.getTransactionsByOperator(operator.getId());
        
        // Calculate stats
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTransactions", transactions.size());
        stats.put("todayTransactions", transactions.stream()
                .filter(t -> t.getTransactionDate().toLocalDate().equals(java.time.LocalDate.now()))
                .count());
        stats.put("totalLitersPumped", transactions.stream()
                .map(TransactionResponse::getPumpedLiters)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add));
        stats.put("totalRevenue", transactions.stream()
                .map(TransactionResponse::getTotalAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add));
        
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Verify app connectivity
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Mobile API is running"));
    }
}