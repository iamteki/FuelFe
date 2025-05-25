package com.fuelquota.service.impl;

import com.fuelquota.dto.request.UpdateProfileRequest;
import com.fuelquota.entity.User;
import com.fuelquota.entity.Vehicle;
import com.fuelquota.entity.VehicleOwner;
import com.fuelquota.exception.ResourceNotFoundException;
import com.fuelquota.repository.UserRepository;
import com.fuelquota.repository.VehicleOwnerRepository;
import com.fuelquota.repository.VehicleRepository;
import com.fuelquota.repository.FuelTransactionRepository;
import com.fuelquota.service.VehicleOwnerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleOwnerServiceImpl implements VehicleOwnerService {

    private final VehicleOwnerRepository vehicleOwnerRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final FuelTransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public VehicleOwner getVehicleOwnerByUserId(Long userId) {
        return vehicleOwnerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("VehicleOwner", "userId", userId));
    }

    @Override
    @Transactional
    public VehicleOwner updateProfile(Long userId, UpdateProfileRequest request) {
        VehicleOwner vehicleOwner = getVehicleOwnerByUserId(userId);
        User user = vehicleOwner.getUser();

        // Update user details if provided
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        // Update password if provided
        if (request.getCurrentPassword() != null && request.getNewPassword() != null) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);

        // Update vehicle owner details
        if (request.getFullName() != null) {
            vehicleOwner.setFullName(request.getFullName());
        }
        if (request.getAddress() != null) {
            vehicleOwner.setAddress(request.getAddress());
        }

        return vehicleOwnerRepository.save(vehicleOwner);
    }

    @Override
    public Map<String, Object> getDashboardStats(Long userId) {
        VehicleOwner vehicleOwner = getVehicleOwnerByUserId(userId);
        List<Vehicle> vehicles = vehicleRepository.findByVehicleOwner(vehicleOwner);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVehicles", vehicles.size());
        stats.put("verifiedVehicles", vehicles.stream().filter(Vehicle::getIsVerified).count());
        
        // Calculate total fuel consumed this month
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        BigDecimal monthlyFuelConsumed = BigDecimal.ZERO;
        int monthlyTransactions = 0;
        
        for (Vehicle vehicle : vehicles) {
            var transactions = transactionRepository.findByVehicleId(vehicle.getId());
            monthlyTransactions += transactions.stream()
                    .filter(t -> t.getTransactionDate().isAfter(startOfMonth))
                    .count();
            
            monthlyFuelConsumed = monthlyFuelConsumed.add(
                    transactions.stream()
                            .filter(t -> t.getTransactionDate().isAfter(startOfMonth))
                            .map(t -> t.getPumpedLiters())
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
            );
        }
        
        stats.put("monthlyFuelConsumed", monthlyFuelConsumed);
        stats.put("monthlyTransactions", monthlyTransactions);
        
        return stats;
    }
}