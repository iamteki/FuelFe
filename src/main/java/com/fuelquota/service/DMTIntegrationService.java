package com.fuelquota.service;

import com.fuelquota.integration.dmt.dto.VehicleVerificationResponse;

public interface DMTIntegrationService {
    VehicleVerificationResponse verifyVehicle(String vehicleNumber, String ownerNic);
}