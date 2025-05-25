package com.mockdmt.service;

import com.mockdmt.dto.VehicleVerificationResponse;
import com.mockdmt.entity.VehicleRegistry;
import com.mockdmt.repository.VehicleRegistryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VehicleRegistryRepository registryRepository;

    public VehicleVerificationResponse verifyVehicle(String vehicleNumber, String ownerNic) {
        log.info("Verifying vehicle: {} with NIC: {}", vehicleNumber, ownerNic);
        
        return registryRepository.findByVehicleNumberAndOwnerNic(vehicleNumber, ownerNic)
                .map(this::buildSuccessResponse)
                .orElse(buildFailureResponse());
    }

    private VehicleVerificationResponse buildSuccessResponse(VehicleRegistry registry) {
        return VehicleVerificationResponse.builder()
                .isValid(true)
                .vehicleNumber(registry.getVehicleNumber())
                .ownerNic(registry.getOwnerNic())
                .ownerName(registry.getOwnerName())
                .vehicleType(registry.getVehicleType())
                .fuelType(registry.getFuelType())
                .engineCapacity(registry.getEngineCapacity())
                .make(registry.getMake())
                .model(registry.getModel())
                .yearOfManufacture(registry.getYearOfManufacture())
                .message("Vehicle verified successfully")
                .build();
    }

    private VehicleVerificationResponse buildFailureResponse() {
        return VehicleVerificationResponse.builder()
                .isValid(false)
                .message("Vehicle not found or owner NIC doesn't match")
                .build();
    }
}