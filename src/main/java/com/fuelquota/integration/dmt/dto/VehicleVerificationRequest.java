package com.fuelquota.integration.dmt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleVerificationRequest {
    private String vehicleNumber;
    private String ownerNic;
}