package com.mockdmt.controller;

import com.mockdmt.dto.VehicleVerificationRequest;
import com.mockdmt.dto.VehicleVerificationResponse;
import com.mockdmt.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dmt")
@RequiredArgsConstructor
public class VehicleVerificationController {

    private final VerificationService verificationService;

    @PostMapping("/verify")
    public ResponseEntity<VehicleVerificationResponse> verifyVehicle(
            @RequestBody VehicleVerificationRequest request) {
        VehicleVerificationResponse response = verificationService.verifyVehicle(
                request.getVehicleNumber(), 
                request.getOwnerNic()
        );
        return ResponseEntity.ok(response);
    }
}