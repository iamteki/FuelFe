package com.fuelquota.dto.mapper;

import com.fuelquota.dto.response.FuelStationResponse;
import com.fuelquota.entity.FuelStation;
import org.springframework.stereotype.Component;

@Component
public class FuelStationMapper {

    public FuelStationResponse toResponse(FuelStation fuelStation) {
        if (fuelStation == null) {
            return null;
        }

        return FuelStationResponse.builder()
                .id(fuelStation.getId())
                .registrationNumber(fuelStation.getRegistrationNumber())
                .stationName(fuelStation.getStationName())
                .address(fuelStation.getAddress())
                .district(fuelStation.getDistrict())
                .province(fuelStation.getProvince())
                .latitude(fuelStation.getLatitude())
                .longitude(fuelStation.getLongitude())
                .contactNumber(fuelStation.getContactNumber())
                .isActive(fuelStation.getIsActive())
                .isApproved(fuelStation.getApprovedBy() != null)
                .approvedAt(fuelStation.getApprovedAt())
                .approvedBy(fuelStation.getApprovedBy() != null ? fuelStation.getApprovedBy().getUsername() : null)
                .createdAt(fuelStation.getCreatedAt())
                .ownerName(fuelStation.getOwnerUser().getUsername())
                .ownerEmail(fuelStation.getOwnerUser().getEmail())
                .ownerPhoneNumber(fuelStation.getOwnerUser().getPhoneNumber())  // Add this line
                .operatorCount(fuelStation.getOperators() != null ? fuelStation.getOperators().size() : 0)
                .build();
    }
}