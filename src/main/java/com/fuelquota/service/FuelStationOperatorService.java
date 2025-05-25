package com.fuelquota.service;

import com.fuelquota.dto.request.OperatorRegistrationRequest;
import com.fuelquota.entity.FuelStationOperator;

import java.util.List;

public interface FuelStationOperatorService {
    
    FuelStationOperator registerOperator(Long fuelStationId, OperatorRegistrationRequest request);
    
    FuelStationOperator getOperatorById(Long id);
    
    FuelStationOperator getOperatorByUserId(Long userId);
    
    List<FuelStationOperator> getOperatorsByFuelStation(Long fuelStationId);
    
    FuelStationOperator updateOperator(Long operatorId, OperatorRegistrationRequest request);
    
    void deactivateOperator(Long operatorId);
    
    void activateOperator(Long operatorId);
}