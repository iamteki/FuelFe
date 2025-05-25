package com.fuelquota.dto.mapper;

import com.fuelquota.dto.response.VehicleResponse;
import com.fuelquota.entity.Vehicle;
import com.fuelquota.service.QuotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VehicleMapper {

    private final QuotaService quotaService;

    public VehicleResponse toResponse(Vehicle vehicle) {
        if (vehicle == null) {
            return null;
        }

        return VehicleResponse.builder()
                .id(vehicle.getId())
                .vehicleNumber(vehicle.getVehicleNumber())
                .vehicleType(vehicle.getVehicleType())
                .fuelType(vehicle.getFuelType())
                .engineCapacity(vehicle.getEngineCapacity())
                .model(vehicle.getModel())
                .make(vehicle.getMake())
                .yearOfManufacture(vehicle.getYearOfManufacture())
                .qrCode(vehicle.getQrCode())
                .isVerified(vehicle.getIsVerified())
                .verifiedAt(vehicle.getVerifiedAt())
                .createdAt(vehicle.getCreatedAt())
                .ownerName(vehicle.getVehicleOwner().getFullName())
                .ownerNic(vehicle.getVehicleOwner().getNic())
                .currentQuota(quotaService.getCurrentQuotaResponse(vehicle.getId()))
                .build();
    }
}