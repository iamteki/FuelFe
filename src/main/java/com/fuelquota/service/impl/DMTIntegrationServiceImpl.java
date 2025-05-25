package com.fuelquota.service.impl;

import com.fuelquota.integration.dmt.DMTClient;
import com.fuelquota.integration.dmt.dto.VehicleVerificationResponse;
import com.fuelquota.service.DMTIntegrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DMTIntegrationServiceImpl implements DMTIntegrationService {

    private final DMTClient dmtClient;

    @Override
    public VehicleVerificationResponse verifyVehicle(String vehicleNumber, String ownerNic) {
        log.info("Verifying vehicle {} with NIC {}", vehicleNumber, ownerNic);
        return dmtClient.verifyVehicle(vehicleNumber, ownerNic);
    }
}