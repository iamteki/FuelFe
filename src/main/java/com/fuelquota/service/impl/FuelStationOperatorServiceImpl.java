package com.fuelquota.service.impl;

import com.fuelquota.dto.request.OperatorRegistrationRequest;
import com.fuelquota.entity.FuelStation;
import com.fuelquota.entity.FuelStationOperator;
import com.fuelquota.entity.User;
import com.fuelquota.entity.enums.UserRole;
import com.fuelquota.exception.BadRequestException;
import com.fuelquota.exception.ResourceNotFoundException;
import com.fuelquota.repository.FuelStationOperatorRepository;
import com.fuelquota.repository.FuelStationRepository;
import com.fuelquota.repository.UserRepository;
import com.fuelquota.service.FuelStationOperatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FuelStationOperatorServiceImpl implements FuelStationOperatorService {

    private final FuelStationOperatorRepository operatorRepository;
    private final FuelStationRepository fuelStationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public FuelStationOperator registerOperator(Long fuelStationId, OperatorRegistrationRequest request) {
        FuelStation fuelStation = fuelStationRepository.findById(fuelStationId)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStation", "id", fuelStationId));
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }
        
        if (operatorRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new BadRequestException("Employee ID already exists!");
        }
        
        // Create user account for operator
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(UserRole.FUEL_STATION_OPERATOR)
                .isActive(true)
                .build();
        
        user = userRepository.save(user);
        
        // Create operator profile
        FuelStationOperator operator = FuelStationOperator.builder()
                .user(user)
                .fuelStation(fuelStation)
                .employeeId(request.getEmployeeId())
                .fullName(request.getFullName())
                .isActive(true)
                .build();
        
        operator = operatorRepository.save(operator);
        log.info("Operator {} registered for fuel station {}", operator.getFullName(), fuelStation.getStationName());
        
        return operator;
    }

    @Override
    public FuelStationOperator getOperatorById(Long id) {
        return operatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStationOperator", "id", id));
    }

    @Override
    public FuelStationOperator getOperatorByUserId(Long userId) {
        return operatorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStationOperator", "userId", userId));
    }

   @Override
    public List<FuelStationOperator> getOperatorsByFuelStation(Long fuelStationId) {
        FuelStation fuelStation = fuelStationRepository.findById(fuelStationId)
                .orElseThrow(() -> new ResourceNotFoundException("FuelStation", "id", fuelStationId));
        
        // Changed to return ALL operators, not just active ones
        return operatorRepository.findByFuelStation(fuelStation);
    }

    @Override
    @Transactional
    public FuelStationOperator updateOperator(Long operatorId, OperatorRegistrationRequest request) {
        FuelStationOperator operator = getOperatorById(operatorId);
        
        operator.setFullName(request.getFullName());
        operator.setEmployeeId(request.getEmployeeId());
        
        // Update user details
        User user = operator.getUser();
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(user);
        
        return operatorRepository.save(operator);
    }

    @Override
    @Transactional
    public void deactivateOperator(Long operatorId) {
        FuelStationOperator operator = getOperatorById(operatorId);
        operator.setIsActive(false);
        operator.getUser().setIsActive(false);
        
        userRepository.save(operator.getUser());
        operatorRepository.save(operator);
        
        log.info("Operator {} deactivated", operator.getFullName());
    }

    @Override
    @Transactional
    public void activateOperator(Long operatorId) {
        FuelStationOperator operator = getOperatorById(operatorId);
        operator.setIsActive(true);
        operator.getUser().setIsActive(true);
        
        userRepository.save(operator.getUser());
        operatorRepository.save(operator);
        
        log.info("Operator {} activated", operator.getFullName());
    }
}