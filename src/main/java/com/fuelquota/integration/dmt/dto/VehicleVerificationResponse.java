package com.fuelquota.integration.dmt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleVerificationResponse {
    private boolean isValid;
    private String vehicleNumber;
    private String ownerNic;
    private String ownerName;
    private String vehicleType;
    private String fuelType;
    private Integer engineCapacity;
    private String make;
    private String model;
    private Integer yearOfManufacture;
    private String message;
}