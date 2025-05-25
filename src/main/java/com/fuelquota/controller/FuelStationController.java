package com.fuelquota.controller;

import com.fuelquota.dto.request.FuelStationRegistrationRequest;
import com.fuelquota.dto.response.ApiResponse;
import com.fuelquota.dto.response.FuelStationResponse;
import com.fuelquota.entity.FuelStation;
import com.fuelquota.security.CustomUserDetails;
import com.fuelquota.service.FuelStationService;
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
@RequestMapping("/fuel-station")
@RequiredArgsConstructor
public class FuelStationController {

    private final FuelStationService fuelStationService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('FUEL_STATION_OWNER')")
    public ResponseEntity<ApiResponse<FuelStation>> registerFuelStation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody FuelStationRegistrationRequest request) {
        FuelStation fuelStation = fuelStationService.registerFuelStation(currentUser.getId(), request);
        return new ResponseEntity<>(
                ApiResponse.success("Fuel station registered successfully", fuelStation),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/my-station")
    @PreAuthorize("hasRole('FUEL_STATION_OWNER')")
    public ResponseEntity<ApiResponse<FuelStationResponse>> getMyFuelStation(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        FuelStationResponse fuelStation = fuelStationService.getFuelStationByOwnerId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(fuelStation));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FuelStationResponse>> getFuelStationById(@PathVariable Long id) {
        FuelStationResponse fuelStation = fuelStationService.getFuelStationById(id);
        return ResponseEntity.ok(ApiResponse.success(fuelStation));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FuelStationResponse>>> getAllFuelStations() {
        List<FuelStationResponse> fuelStations = fuelStationService.getAllFuelStations();
        return ResponseEntity.ok(ApiResponse.success(fuelStations));
    }

    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<FuelStationResponse>>> getAllFuelStationsPaginated(Pageable pageable) {
        Page<FuelStationResponse> fuelStations = fuelStationService.getAllFuelStations(pageable);
        return ResponseEntity.ok(ApiResponse.success(fuelStations));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FUEL_STATION_OWNER')")
    public ResponseEntity<ApiResponse<FuelStation>> updateFuelStation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id,
            @Valid @RequestBody FuelStationRegistrationRequest request) {
        FuelStation fuelStation = fuelStationService.updateFuelStation(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Fuel station updated successfully", fuelStation));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FUEL_STATION_OWNER')")
    public ResponseEntity<ApiResponse<?>> deactivateFuelStation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id) {
        fuelStationService.deactivateFuelStation(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Fuel station deactivated successfully", null));
    }
}