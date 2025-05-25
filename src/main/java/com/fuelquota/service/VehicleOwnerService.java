package com.fuelquota.service;

import com.fuelquota.dto.request.UpdateProfileRequest;
import com.fuelquota.entity.VehicleOwner;

import java.util.Map;

public interface VehicleOwnerService {
    VehicleOwner getVehicleOwnerByUserId(Long userId);
    VehicleOwner updateProfile(Long userId, UpdateProfileRequest request);
    Map<String, Object> getDashboardStats(Long userId);
}