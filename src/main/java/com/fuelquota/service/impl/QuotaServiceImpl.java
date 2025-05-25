package com.fuelquota.service.impl;

import com.fuelquota.dto.response.QuotaResponse;
import com.fuelquota.entity.FuelQuota;
import com.fuelquota.entity.Vehicle;
import com.fuelquota.exception.BadRequestException;
import com.fuelquota.exception.InsufficientQuotaException;
import com.fuelquota.exception.ResourceNotFoundException;
import com.fuelquota.repository.FuelQuotaRepository;
import com.fuelquota.repository.VehicleRepository;
import com.fuelquota.service.QuotaService;
import com.fuelquota.util.QuotaCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuotaServiceImpl implements QuotaService {

    private final FuelQuotaRepository fuelQuotaRepository;
    private final VehicleRepository vehicleRepository;
    private final QuotaCalculator quotaCalculator;

    @Override
    @Transactional
    public FuelQuota createWeeklyQuota(Vehicle vehicle) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate weekEnd = weekStart.plusDays(6);

        // Check if quota already exists
        if (fuelQuotaRepository.findByVehicleAndWeekStartDate(vehicle, weekStart).isPresent()) {
            throw new BadRequestException("Weekly quota already exists for this vehicle");
        }

        BigDecimal weeklyQuota = calculateWeeklyQuota(vehicle);

        FuelQuota fuelQuota = FuelQuota.builder()
                .vehicle(vehicle)
                .weekStartDate(weekStart)
                .weekEndDate(weekEnd)
                .allocatedQuota(weeklyQuota)
                .remainingQuota(weeklyQuota)
                .build();

        fuelQuota = fuelQuotaRepository.save(fuelQuota);
        log.info("Created weekly quota for vehicle {}: {} liters", vehicle.getVehicleNumber(), weeklyQuota);
        
        return fuelQuota;
    }

    @Override
    public FuelQuota getCurrentQuota(Long vehicleId) {
        LocalDate today = LocalDate.now();
        FuelQuota quota = fuelQuotaRepository.findCurrentQuota(vehicleId, today)
                .orElseGet(() -> {
                    // Create new quota if not exists
                    Vehicle vehicle = vehicleRepository.findById(vehicleId)
                            .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", vehicleId));
                    return createWeeklyQuota(vehicle);
                });
        
        return quota;
    }

    @Override
    public QuotaResponse getCurrentQuotaResponse(Long vehicleId) {
        FuelQuota quota = getCurrentQuota(vehicleId);
        
        BigDecimal usedQuota = quota.getAllocatedQuota().subtract(quota.getRemainingQuota());
        Double usagePercentage = usedQuota.divide(quota.getAllocatedQuota(), 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue();
        
        return QuotaResponse.builder()
                .id(quota.getId())
                .vehicleId(vehicleId)
                .weekStartDate(quota.getWeekStartDate())
                .weekEndDate(quota.getWeekEndDate())
                .allocatedQuota(quota.getAllocatedQuota())
                .remainingQuota(quota.getRemainingQuota())
                .usedQuota(usedQuota)
                .usagePercentage(usagePercentage)
                .build();
    }

    @Override
    @Transactional
    public FuelQuota deductQuota(Long vehicleId, BigDecimal amount) {
        FuelQuota quota = getCurrentQuota(vehicleId);
        
        if (quota.getRemainingQuota().compareTo(amount) < 0) {
            throw new InsufficientQuotaException("Insufficient fuel quota. Available: " + 
                    quota.getRemainingQuota() + " liters");
        }
        
        quota.setRemainingQuota(quota.getRemainingQuota().subtract(amount));
        quota = fuelQuotaRepository.save(quota);
        
        log.info("Deducted {} liters from vehicle {} quota. Remaining: {}", 
                amount, vehicleId, quota.getRemainingQuota());
        
        return quota;
    }

    @Override
    @Transactional
    public void resetWeeklyQuotas() {
        log.info("Starting weekly quota reset process");
        
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        int count = 0;
        
        for (Vehicle vehicle : vehicles) {
            if (!fuelQuotaRepository.findByVehicleAndWeekStartDate(vehicle, weekStart).isPresent()) {
                createWeeklyQuota(vehicle);
                count++;
            }
        }
        
        log.info("Weekly quota reset completed. Created {} new quotas", count);
    }

    @Override
    public BigDecimal calculateWeeklyQuota(Vehicle vehicle) {
        return quotaCalculator.calculateWeeklyQuota(vehicle);
    }
    
}