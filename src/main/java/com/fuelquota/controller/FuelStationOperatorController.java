package com.fuelquota.controller;

import com.fuelquota.dto.request.OperatorRegistrationRequest;
import com.fuelquota.dto.response.ApiResponse;
import com.fuelquota.entity.FuelStation;
import com.fuelquota.entity.FuelStationOperator;
import com.fuelquota.security.CustomUserDetails;
import com.fuelquota.service.FuelStationOperatorService;
import com.fuelquota.service.FuelStationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fuel-station/operators")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FUEL_STATION_OWNER')")
public class FuelStationOperatorController {

    private final FuelStationOperatorService operatorService;
    private final FuelStationService fuelStationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<FuelStationOperator>> registerOperator(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody OperatorRegistrationRequest request) {
        
        // Get the fuel station owned by current user
        FuelStation fuelStation = fuelStationService.getFuelStationEntityByOwnerId(currentUser.getId());
        FuelStationOperator operator = operatorService.registerOperator(fuelStation.getId(), request);
        
        return new ResponseEntity<>(
                ApiResponse.success("Operator registered successfully", operator),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FuelStationOperator>>> getMyOperators(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        FuelStation fuelStation = fuelStationService.getFuelStationEntityByOwnerId(currentUser.getId());
        List<FuelStationOperator> operators = operatorService.getOperatorsByFuelStation(fuelStation.getId());
        
        return ResponseEntity.ok(ApiResponse.success(operators));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FuelStationOperator>> getOperatorById(@PathVariable Long id) {
        FuelStationOperator operator = operatorService.getOperatorById(id);
        return ResponseEntity.ok(ApiResponse.success(operator));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FuelStationOperator>> updateOperator(
            @PathVariable Long id,
            @Valid @RequestBody OperatorRegistrationRequest request) {
        FuelStationOperator operator = operatorService.updateOperator(id, request);
        return ResponseEntity.ok(ApiResponse.success("Operator updated successfully", operator));
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<?>> deactivateOperator(@PathVariable Long id) {
        operatorService.deactivateOperator(id);
        return ResponseEntity.ok(ApiResponse.success("Operator deactivated successfully", null));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<?>> activateOperator(@PathVariable Long id) {
        operatorService.activateOperator(id);
        return ResponseEntity.ok(ApiResponse.success("Operator activated successfully", null));
    }
}