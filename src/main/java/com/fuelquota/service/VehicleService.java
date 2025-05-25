package com.fuelquota.service;

import com.fuelquota.dto.request.VehicleRegistrationRequest;
import com.fuelquota.dto.response.VehicleResponse;
import com.fuelquota.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VehicleService {
    
    Vehicle registerVehicle(Long userId, VehicleRegistrationRequest request);
    
    VehicleResponse getVehicleById(Long vehicleId);
    
    VehicleResponse getVehicleByNumber(String vehicleNumber);
    
    VehicleResponse getVehicleByQrCode(String qrCode);
    
    List<VehicleResponse> getVehiclesByOwnerId(Long userId);
    
    Page<VehicleResponse> getVehiclesByOwnerId(Long userId, Pageable pageable);
    
    void deleteVehicle(Long userId, Long vehicleId);
    
    Vehicle updateVehicle(Long userId, Long vehicleId, VehicleRegistrationRequest request);
}