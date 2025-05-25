package com.fuelquota.service;

import com.fuelquota.dto.request.FuelPumpingRequest;
import com.fuelquota.dto.response.TransactionResponse;
import com.fuelquota.dto.response.VehicleResponse;
import com.fuelquota.entity.FuelTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TransactionService {
    
    VehicleResponse scanQRCode(String qrCode);
    
    FuelTransaction pumpFuel(Long operatorId, FuelPumpingRequest request);
    
    TransactionResponse getTransactionById(Long transactionId);
    
    List<TransactionResponse> getTransactionsByVehicle(Long vehicleId);
    
    Page<TransactionResponse> getTransactionsByVehicle(Long vehicleId, Pageable pageable);
    
    List<TransactionResponse> getTransactionsByFuelStation(Long fuelStationId);
    
    Page<TransactionResponse> getTransactionsByFuelStation(Long fuelStationId, Pageable pageable);
    
    List<TransactionResponse> getTransactionsByOperator(Long operatorId);
}