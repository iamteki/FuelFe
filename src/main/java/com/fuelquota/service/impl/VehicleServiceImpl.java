package com.fuelquota.service.impl;

import com.fuelquota.dto.mapper.VehicleMapper;
import com.fuelquota.dto.request.VehicleRegistrationRequest;
import com.fuelquota.dto.response.VehicleResponse;
import com.fuelquota.entity.Vehicle;
import com.fuelquota.entity.VehicleOwner;
import com.fuelquota.exception.BadRequestException;
import com.fuelquota.exception.ResourceNotFoundException;
import com.fuelquota.integration.dmt.dto.VehicleVerificationResponse;
import com.fuelquota.repository.VehicleOwnerRepository;
import com.fuelquota.repository.VehicleRepository;
import com.fuelquota.service.DMTIntegrationService;
import com.fuelquota.service.QRCodeService;
import com.fuelquota.service.QuotaService;
import com.fuelquota.service.VehicleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleOwnerRepository vehicleOwnerRepository;
    private final DMTIntegrationService dmtIntegrationService;
    private final QRCodeService qrCodeService;
    private final QuotaService quotaService;
    private final VehicleMapper vehicleMapper;

    @Override
    @Transactional
    public Vehicle registerVehicle(Long userId, VehicleRegistrationRequest request) {
        // Get vehicle owner
        VehicleOwner vehicleOwner = vehicleOwnerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("VehicleOwner", "userId", userId));

        // Check if vehicle already exists
        if (vehicleRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new BadRequestException("Vehicle with this number already exists");
        }

        // Verify with DMT
        VehicleVerificationResponse dmtResponse = dmtIntegrationService.verifyVehicle(
                request.getVehicleNumber(), vehicleOwner.getNic());

        if (!dmtResponse.isValid()) {
            throw new BadRequestException("Vehicle verification failed: " + dmtResponse.getMessage());
        }

        // Create vehicle
        Vehicle vehicle = Vehicle.builder()
                .vehicleOwner(vehicleOwner)
                .vehicleNumber(request.getVehicleNumber())
                .vehicleType(request.getVehicleType())
                .fuelType(request.getFuelType())
                .engineCapacity(request.getEngineCapacity())
                .model(request.getModel())
                .make(request.getMake())
                .yearOfManufacture(request.getYearOfManufacture())
                .isVerified(true)
                .verifiedAt(LocalDateTime.now())
                .build();

        vehicle = vehicleRepository.save(vehicle);

        // Generate QR code
        String qrCode = qrCodeService.generateQRCode(vehicle);
        vehicle.setQrCode(qrCode);
        vehicle = vehicleRepository.save(vehicle);

        // Create initial quota
        quotaService.createWeeklyQuota(vehicle);

        log.info("Vehicle registered successfully: {}", vehicle.getVehicleNumber());
        return vehicle;
    }

    @Override
    public VehicleResponse getVehicleById(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", vehicleId));
        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    public VehicleResponse getVehicleByNumber(String vehicleNumber) {
        Vehicle vehicle = vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "vehicleNumber", vehicleNumber));
        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    public VehicleResponse getVehicleByQrCode(String qrCode) {
        Vehicle vehicle = vehicleRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "qrCode", qrCode));
        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    public List<VehicleResponse> getVehiclesByOwnerId(Long userId) {
        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(userId);
        return vehicles.stream()
                .map(vehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<VehicleResponse> getVehiclesByOwnerId(Long userId, Pageable pageable) {
        Page<Vehicle> vehicles = vehicleRepository.findByOwnerId(userId, pageable);
        return vehicles.map(vehicleMapper::toResponse);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long userId, Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", vehicleId));
        
        if (!vehicle.getVehicleOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this vehicle");
        }
        
        vehicleRepository.delete(vehicle);
        log.info("Vehicle deleted: {}", vehicle.getVehicleNumber());
    }

    @Override
    @Transactional
    public Vehicle updateVehicle(Long userId, Long vehicleId, VehicleRegistrationRequest request) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", vehicleId));
        
        if (!vehicle.getVehicleOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this vehicle");
        }
        
        // Update fields that can be changed
        vehicle.setEngineCapacity(request.getEngineCapacity());
        vehicle.setModel(request.getModel());
        vehicle.setMake(request.getMake());
        
        return vehicleRepository.save(vehicle);
    }
}