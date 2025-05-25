package com.fuelquota.service.impl;

import com.fuelquota.dto.response.DashboardStatsResponse;
import com.fuelquota.entity.User;
import com.fuelquota.entity.enums.UserRole;
import com.fuelquota.exception.ResourceNotFoundException;
import com.fuelquota.repository.*;
import com.fuelquota.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final FuelStationRepository fuelStationRepository;
    private final FuelTransactionRepository transactionRepository;
    private final FuelStationOperatorRepository operatorRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        // Calculate stats
        Long totalUsers = userRepository.count();
        Long totalVehicles = vehicleRepository.count();
        Long totalFuelStations = fuelStationRepository.count();
        Long pendingFuelStations = (long) fuelStationRepository.findPendingApproval().size();
        Long totalTransactions = transactionRepository.count();
        Long activeOperators = (long) operatorRepository.findAll().stream()
                .filter(op -> op.getIsActive())
                .count();

        // Calculate today's stats
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        
        var todayTransactions = transactionRepository.findTransactionsBetweenDates(startOfDay, endOfDay);
        Long todayTransactionCount = (long) todayTransactions.size();
        
        BigDecimal todayFuelPumped = todayTransactions.stream()
                .map(t -> t.getPumpedLiters())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate totals
        BigDecimal totalFuelPumped = transactionRepository.findAll().stream()
                .map(t -> t.getPumpedLiters())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRevenue = transactionRepository.findAll().stream()
                .map(t -> t.getTotalAmount() != null ? t.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalVehicles(totalVehicles)
                .totalFuelStations(totalFuelStations)
                .pendingFuelStations(pendingFuelStations)
                .totalTransactions(totalTransactions)
                .totalFuelPumped(totalFuelPumped)
                .totalRevenue(totalRevenue)
                .todayTransactions(todayTransactionCount)
                .todayFuelPumped(todayFuelPumped)
                .activeOperators(activeOperators)
                .build();
    }

    @Override
    public Page<Object> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(user -> (Object) user);
    }

    @Override
    @Transactional
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setIsActive(true);
        userRepository.save(user);
        log.info("User {} activated", user.getUsername());
    }

    @Override
    @Transactional
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setIsActive(false);
        userRepository.save(user);
        log.info("User {} deactivated", user.getUsername());
    }
}