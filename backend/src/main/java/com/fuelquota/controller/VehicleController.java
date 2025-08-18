package com.fuelquota.controller;

import com.fuelquota.dto.VehicleRegistrationRequest;
import com.fuelquota.entity.*;
import com.fuelquota.repository.UserRepository;
import com.fuelquota.repository.VehicleRepository;
import com.fuelquota.security.UserPrincipal;
import com.fuelquota.service.QRCodeService;
import com.fuelquota.service.QuotaCalculationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QRCodeService qrCodeService;

    @Autowired
    private QuotaCalculationService quotaCalculationService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('VEHICLE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> registerVehicle(@Valid @RequestBody VehicleRegistrationRequest request,
                                           Authentication authentication) {
        try {
            // Check if vehicle already exists
            if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
                return ResponseEntity.badRequest()
                        .body("Error: Vehicle with this registration number already exists!");
            }

            // Get current user
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Optional<User> userOptional = userRepository.findById(userPrincipal.getId());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Error: User not found!");
            }

            User owner = userOptional.get();

            // Create new vehicle
            Vehicle vehicle = new Vehicle();
            vehicle.setRegistrationNumber(request.getRegistrationNumber());
            vehicle.setMake(request.getMake());
            vehicle.setModel(request.getModel());
            vehicle.setManufactureYear(request.getManufactureYear());
            vehicle.setVehicleType(VehicleType.valueOf(request.getVehicleType().toUpperCase()));
            vehicle.setFuelType(FuelType.valueOf(request.getFuelType().toUpperCase()));
            vehicle.setEngineCapacity(request.getEngineCapacity());
            vehicle.setOwner(owner);
            vehicle.setIsRegistered(true);
            vehicle.setRegistrationDate(LocalDateTime.now());

            // Calculate and assign quota
            quotaCalculationService.assignQuotaToVehicle(vehicle);

            // Save vehicle
            Vehicle savedVehicle = vehicleRepository.save(vehicle);

            // Generate QR code
            try {
                String qrCodePath = qrCodeService.generateQRCodeForVehicle(savedVehicle);
                return ResponseEntity.ok("Vehicle registered successfully! QR Code generated at: " + qrCodePath);
            } catch (Exception e) {
                return ResponseEntity.ok("Vehicle registered successfully! QR Code generation failed: " + e.getMessage());
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Error: Invalid vehicle type or fuel type specified!");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/my-vehicles")
    @PreAuthorize("hasRole('VEHICLE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<Vehicle>> getMyVehicles(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(userPrincipal.getId());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('VEHICLE_OWNER') and @vehicleRepository.findById(#id).orElse(null)?.owner?.id == authentication.principal.id)")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        return vehicle.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STATION_MANAGER')")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STATION_MANAGER')")
    public ResponseEntity<List<Vehicle>> searchVehicles(@RequestParam String keyword) {
        List<Vehicle> vehicles = vehicleRepository.searchVehicles(keyword);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}/quota")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STATION_MANAGER') or (hasRole('VEHICLE_OWNER') and @vehicleRepository.findById(#id).orElse(null)?.owner?.id == authentication.principal.id)")
    public ResponseEntity<?> getVehicleQuota(@PathVariable Long id) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(id);
        if (vehicleOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Vehicle vehicle = vehicleOpt.get();
        Double remainingQuota = quotaCalculationService.getRemainingQuota(vehicle);
        long daysUntilReset = quotaCalculationService.getDaysUntilQuotaReset(vehicle);

        return ResponseEntity.ok(Map.of(
            "vehicleId", vehicle.getId(),
            "registrationNumber", vehicle.getRegistrationNumber(),
            "weeklyQuota", vehicle.getWeeklyQuota(),
            "remainingQuota", remainingQuota,
            "daysUntilReset", daysUntilReset,
            "lastReset", vehicle.getLastQuotaReset()
        ));
    }
}
