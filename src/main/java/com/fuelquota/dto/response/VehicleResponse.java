package com.fuelquota.dto.response;

import com.fuelquota.entity.enums.FuelType;
import com.fuelquota.entity.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {
    private Long id;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private FuelType fuelType;
    private Integer engineCapacity;
    private String model;
    private String make;
    private Integer yearOfManufacture;
    private String qrCode;
    private Boolean isVerified;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;
    private String ownerName;
    private String ownerNic;
    private QuotaResponse currentQuota;
}