package com.fuelquota.service;

import com.fuelquota.dto.request.FuelStationRegistrationRequest;
import com.fuelquota.dto.response.FuelStationResponse;
import com.fuelquota.entity.FuelStation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FuelStationService {
    
    FuelStation registerFuelStation(Long userId, FuelStationRegistrationRequest request);
    
    FuelStation approveFuelStation(Long stationId, Long adminId);
    
    FuelStation rejectFuelStation(Long stationId, Long adminId);
    
    FuelStationResponse getFuelStationById(Long id);
    
    FuelStationResponse getFuelStationByOwnerId(Long ownerId);
    
    FuelStation getFuelStationEntityByOwnerId(Long ownerId);
    
    List<FuelStationResponse> getAllFuelStations();
    
    Page<FuelStationResponse> getAllFuelStations(Pageable pageable);
    
    List<FuelStationResponse> getPendingApprovalStations();
    
    Page<FuelStationResponse> getPendingApprovalStations(Pageable pageable);
    
    FuelStation updateFuelStation(Long userId, Long stationId, FuelStationRegistrationRequest request);
    
    void deactivateFuelStation(Long stationId, Long userId);
}