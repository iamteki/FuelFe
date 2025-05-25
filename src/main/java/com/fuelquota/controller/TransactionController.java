package com.fuelquota.controller;

import com.fuelquota.dto.request.FuelPumpingRequest;
import com.fuelquota.dto.response.ApiResponse;
import com.fuelquota.dto.response.TransactionResponse;
import com.fuelquota.dto.response.VehicleResponse;
import com.fuelquota.entity.FuelStationOperator;
import com.fuelquota.entity.FuelTransaction;
import com.fuelquota.security.CustomUserDetails;
import com.fuelquota.service.FuelStationOperatorService;
import com.fuelquota.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final FuelStationOperatorService operatorService;

    @PostMapping("/scan-qr")
    @PreAuthorize("hasRole('FUEL_STATION_OPERATOR')")
    public ResponseEntity<ApiResponse<VehicleResponse>> scanQRCode(@RequestParam String qrCode) {
        VehicleResponse vehicle = transactionService.scanQRCode(qrCode);
        return ResponseEntity.ok(ApiResponse.success("QR code scanned successfully", vehicle));
    }

    @PostMapping("/pump-fuel")
    @PreAuthorize("hasRole('FUEL_STATION_OPERATOR')")
    public ResponseEntity<ApiResponse<FuelTransaction>> pumpFuel(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody FuelPumpingRequest request) {
        
        FuelStationOperator operator = operatorService.getOperatorByUserId(currentUser.getId());
        FuelTransaction transaction = transactionService.pumpFuel(operator.getId(), request);
        
        return new ResponseEntity<>(
                ApiResponse.success("Fuel pumped successfully", transaction),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(@PathVariable Long id) {
        TransactionResponse transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsByVehicle(@PathVariable Long vehicleId) {
        List<TransactionResponse> transactions = transactionService.getTransactionsByVehicle(vehicleId);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/vehicle/{vehicleId}/page")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactionsByVehiclePaginated(
            @PathVariable Long vehicleId,
            Pageable pageable) {
        Page<TransactionResponse> transactions = transactionService.getTransactionsByVehicle(vehicleId, pageable);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/fuel-station/{stationId}")
    @PreAuthorize("hasAnyRole('FUEL_STATION_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsByFuelStation(@PathVariable Long stationId) {
        List<TransactionResponse> transactions = transactionService.getTransactionsByFuelStation(stationId);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/fuel-station/{stationId}/page")
    @PreAuthorize("hasAnyRole('FUEL_STATION_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactionsByFuelStationPaginated(
            @PathVariable Long stationId,
            Pageable pageable) {
        Page<TransactionResponse> transactions = transactionService.getTransactionsByFuelStation(stationId, pageable);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/my-transactions")
    @PreAuthorize("hasRole('FUEL_STATION_OPERATOR')")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getMyTransactions(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        FuelStationOperator operator = operatorService.getOperatorByUserId(currentUser.getId());
        List<TransactionResponse> transactions = transactionService.getTransactionsByOperator(operator.getId());
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }
}