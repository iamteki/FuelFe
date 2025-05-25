package com.fuelquota.service.impl;

import com.fuelquota.dto.mapper.FuelStationMapper;
import com.fuelquota.dto.request.FuelStationRegistrationRequest;
import com.fuelquota.dto.response.FuelStationResponse;
import com.fuelquota.entity.FuelStation;
import com.fuelquota.entity.User;
import com.fuelquota.entity.enums.UserRole;
import com.fuelquota.exception.BadRequestException;
import com.fuelquota.exception.ResourceNotFoundException;
import com.fuelquota.repository.FuelStationRepository;
import com.fuelquota.repository.UserRepository;
import com.fuelquota.service.FuelStationService;
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
public class FuelStationServiceImpl implements FuelStationService {

    private final FuelStationRepository fuelStationRepository;
    private final UserRepository userRepository;
    private final FuelStationMapper fuelStationMapper;

    @Override
    @Transactional
    public FuelStation registerFuelStation(Long userId, FuelStationRegistrationRequest request) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        if (owner.getRole() != UserRole.FUEL_STATION_OWNER) {
            throw new BadRequestException("Only fuel station owners can register fuel stations");
        }
        
        if (fuelStationRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new BadRequestException("Fuel station with this registration number already exists");
        }
        
        if (fuelStationRepository.findByOwnerUser(owner).isPresent()) {
            throw new BadRequestException("You have already registered a fuel station");
        }
        
        FuelStation fuelStation = FuelStation.builder()
                .ownerUser(owner)
                .registrationNumber(request.getRegistrationNumber())
                .stationName(request.getStationName())
                .address(request.getAddress())
                .district(request.getDistrict())
                .province(request.getProvince())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .contactNumber(request.getContactNumber())
                .isActive(true)
                .build();
        
        fuelStation = fuelStationRepository.save(fuelStation);
        log.info("Fuel station registered: {}", fuelStation.getStationName());
        
        return fuelStation;
    }

    @Override
    @Transactional
    public FuelStation approveFuelStation(Long stationId, Long adminId) {
        FuelStation fuelStation = fuelStationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStation", "id", stationId));
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminId));
        
        if (fuelStation.getApprovedBy() != null) {
            throw new BadRequestException("Fuel station is already approved");
        }
        
        fuelStation.setApprovedBy(admin);
        fuelStation.setApprovedAt(LocalDateTime.now());
        
        fuelStation = fuelStationRepository.save(fuelStation);
        log.info("Fuel station {} approved by admin {}", fuelStation.getStationName(), admin.getUsername());
        
        return fuelStation;
    }

    @Override
    @Transactional
    public FuelStation rejectFuelStation(Long stationId, Long adminId) {
        FuelStation fuelStation = fuelStationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStation", "id", stationId));
        
        fuelStation.setIsActive(false);
        fuelStation = fuelStationRepository.save(fuelStation);
        
        log.info("Fuel station {} rejected by admin", fuelStation.getStationName());
        return fuelStation;
    }

    @Override
    public FuelStationResponse getFuelStationById(Long id) {
        FuelStation fuelStation = fuelStationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStation", "id", id));
        return fuelStationMapper.toResponse(fuelStation);
    }

    @Override
    public FuelStationResponse getFuelStationByOwnerId(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));
        
        FuelStation fuelStation = fuelStationRepository.findByOwnerUser(owner)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStation", "ownerId", ownerId));
        
        return fuelStationMapper.toResponse(fuelStation);
    }

    @Override
    public FuelStation getFuelStationEntityByOwnerId(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));
        
        return fuelStationRepository.findByOwnerUser(owner)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStation", "ownerId", ownerId));
    }

    @Override
    public List<FuelStationResponse> getAllFuelStations() {
        return fuelStationRepository.findByIsActive(true).stream()
                .map(fuelStationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<FuelStationResponse> getAllFuelStations(Pageable pageable) {
        return fuelStationRepository.findByIsActive(true, pageable)
                .map(fuelStationMapper::toResponse);
    }

    @Override
    public List<FuelStationResponse> getPendingApprovalStations() {
        return fuelStationRepository.findPendingApproval().stream()
                .map(fuelStationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<FuelStationResponse> getPendingApprovalStations(Pageable pageable) {
        return fuelStationRepository.findPendingApproval(pageable)
                .map(fuelStationMapper::toResponse);
    }

    @Override
    @Transactional
    public FuelStation updateFuelStation(Long userId, Long stationId, FuelStationRegistrationRequest request) {
        FuelStation fuelStation = fuelStationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStation", "id", stationId));
        
        if (!fuelStation.getOwnerUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this fuel station");
        }
        
        fuelStation.setStationName(request.getStationName());
        fuelStation.setAddress(request.getAddress());
        fuelStation.setDistrict(request.getDistrict());
        fuelStation.setProvince(request.getProvince());
        fuelStation.setLatitude(request.getLatitude());
        fuelStation.setLongitude(request.getLongitude());
        fuelStation.setContactNumber(request.getContactNumber());
        
        return fuelStationRepository.save(fuelStation);
    }

    @Override
    @Transactional
    public void deactivateFuelStation(Long stationId, Long userId) {
        FuelStation fuelStation = fuelStationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStation", "id", stationId));
        
        if (!fuelStation.getOwnerUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to deactivate this fuel station");
        }
        
        fuelStation.setIsActive(false);
        fuelStationRepository.save(fuelStation);
        
        log.info("Fuel station {} deactivated", fuelStation.getStationName());
    }
}