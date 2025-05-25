package com.fuelquota.controller;

import com.fuelquota.dto.request.VehicleRegistrationRequest;
import com.fuelquota.dto.response.ApiResponse;
import com.fuelquota.dto.response.VehicleResponse;
import com.fuelquota.entity.Vehicle;
import com.fuelquota.security.CustomUserDetails;
import com.fuelquota.service.VehicleService;
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
@RequestMapping("/vehicle-owner/vehicles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VEHICLE_OWNER')")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Vehicle>> registerVehicle(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody VehicleRegistrationRequest request) {
        Vehicle vehicle = vehicleService.registerVehicle(currentUser.getId(), request);
        return new ResponseEntity<>(
                ApiResponse.success("Vehicle registered successfully", vehicle),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getMyVehicles(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<VehicleResponse> vehicles = vehicleService.getVehiclesByOwnerId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(vehicles));
    }

    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<VehicleResponse>>> getMyVehiclesPaginated(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            Pageable pageable) {
        Page<VehicleResponse> vehicles = vehicleService.getVehiclesByOwnerId(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(vehicles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleById(@PathVariable Long id) {
        VehicleResponse vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(ApiResponse.success(vehicle));
    }

    @GetMapping("/by-number/{vehicleNumber}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleByNumber(@PathVariable String vehicleNumber) {
        VehicleResponse vehicle = vehicleService.getVehicleByNumber(vehicleNumber);
        return ResponseEntity.ok(ApiResponse.success(vehicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Vehicle>> updateVehicle(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id,
            @Valid @RequestBody VehicleRegistrationRequest request) {
        Vehicle vehicle = vehicleService.updateVehicle(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully", vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteVehicle(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id) {
        vehicleService.deleteVehicle(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle deleted successfully", null));
    }
}