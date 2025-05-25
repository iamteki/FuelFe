package com.fuelquota.service.impl;

import com.fuelquota.dto.mapper.TransactionMapper;
import com.fuelquota.dto.mapper.VehicleMapper;
import com.fuelquota.dto.request.FuelPumpingRequest;
import com.fuelquota.dto.response.TransactionResponse;
import com.fuelquota.dto.response.VehicleResponse;
import com.fuelquota.entity.*;
import com.fuelquota.exception.BadRequestException;
import com.fuelquota.exception.ResourceNotFoundException;
import com.fuelquota.repository.*;
import com.fuelquota.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final FuelTransactionRepository transactionRepository;
    private final VehicleRepository vehicleRepository;
    private final FuelStationOperatorRepository operatorRepository;
    private final QRCodeService qrCodeService;
    private final QuotaService quotaService;
    private final NotificationService notificationService;
    private final VehicleMapper vehicleMapper;
    private final TransactionMapper transactionMapper;

    @Override
    public VehicleResponse scanQRCode(String qrCode) {
        Vehicle vehicle = qrCodeService.parseQRCode(qrCode);
        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    @Transactional
    public FuelTransaction pumpFuel(Long operatorId, FuelPumpingRequest request) {
        // Get operator
        FuelStationOperator operator = operatorRepository.findById(operatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Operator", "id", operatorId));
        
        // Get vehicle
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", request.getVehicleId()));
        
        // Validate fuel type
        if (!vehicle.getFuelType().equals(request.getFuelType())) {
            throw new BadRequestException("Vehicle fuel type doesn't match the requested fuel type");
        }
        
        // Get and deduct quota
        FuelQuota quota = quotaService.deductQuota(vehicle.getId(), request.getPumpedLiters());
        
        // Calculate total amount
        BigDecimal totalAmount = request.getPumpedLiters().multiply(request.getUnitPrice());
        
        // Create transaction
        FuelTransaction transaction = FuelTransaction.builder()
                .vehicle(vehicle)
                .fuelStation(operator.getFuelStation())
                .operator(operator)
                .fuelQuota(quota)
                .pumpedLiters(request.getPumpedLiters())
                .fuelType(request.getFuelType())
                .unitPrice(request.getUnitPrice())
                .totalAmount(totalAmount)
                .transactionDate(LocalDateTime.now())
                .build();
        
        transaction = transactionRepository.save(transaction);
        
        // Send notification
        try {
            notificationService.sendTransactionNotification(transaction);
            transaction.setSmsSent(true);
            transaction.setSmsSentAt(LocalDateTime.now());
            transaction = transactionRepository.save(transaction);
        } catch (Exception e) {
            log.error("Failed to send SMS notification for transaction {}", transaction.getId(), e);
        }
        
        log.info("Fuel transaction completed: {} liters pumped for vehicle {}", 
                request.getPumpedLiters(), vehicle.getVehicleNumber());
        
        return transaction;
    }

    @Override
    public TransactionResponse getTransactionById(Long transactionId) {
        FuelTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));
        return transactionMapper.toResponse(transaction);
    }

    @Override
    public List<TransactionResponse> getTransactionsByVehicle(Long vehicleId) {
        List<FuelTransaction> transactions = transactionRepository.findByVehicleId(vehicleId);
        return transactions.stream()
                .map(transactionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TransactionResponse> getTransactionsByVehicle(Long vehicleId, Pageable pageable) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", vehicleId));
        return transactionRepository.findByVehicle(vehicle, pageable)
                .map(transactionMapper::toResponse);
    }

    @Override
    public List<TransactionResponse> getTransactionsByFuelStation(Long fuelStationId) {
        List<FuelTransaction> transactions = transactionRepository.findByFuelStationId(fuelStationId);
        return transactions.stream()
                .map(transactionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TransactionResponse> getTransactionsByFuelStation(Long fuelStationId, Pageable pageable) {
        FuelStation fuelStation = new FuelStation();
        fuelStation.setId(fuelStationId);
        return transactionRepository.findByFuelStation(fuelStation, pageable)
                .map(transactionMapper::toResponse);
    }

    @Override
    public List<TransactionResponse> getTransactionsByOperator(Long operatorId) {
        List<FuelTransaction> transactions = transactionRepository.findByOperatorId(operatorId);
        return transactions.stream()
                .map(transactionMapper::toResponse)
                .collect(Collectors.toList());
    }
}