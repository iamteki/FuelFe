package com.fuelquota.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MobileVehicleResponse {
    private Long vehicleId;
    private String vehicleNumber;
    private String vehicleType;
    private String fuelType;
    private String ownerName;
    private QuotaResponse currentQuota;
    private Boolean isVerified;
    private Boolean canPumpFuel;
}