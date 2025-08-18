package com.fuelquota.service;

import com.fuelquota.entity.Vehicle;
import com.fuelquota.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Service
public class QuotaCalculationService {

    @Autowired
    private VehicleRepository vehicleRepository;

    private static final Map<String, Double> WEEKLY_QUOTA_MAP = new HashMap<>();
    
    static {
        // Weekly quota in liters based on vehicle type
        WEEKLY_QUOTA_MAP.put("CAR", 20.0);
        WEEKLY_QUOTA_MAP.put("MOTORCYCLE", 4.0);
        WEEKLY_QUOTA_MAP.put("THREE_WHEELER", 8.0);
        WEEKLY_QUOTA_MAP.put("VAN", 30.0);
        WEEKLY_QUOTA_MAP.put("LORRY", 50.0);
        WEEKLY_QUOTA_MAP.put("BUS", 80.0);
        WEEKLY_QUOTA_MAP.put("TRUCK", 100.0);
    }

    public Double calculateWeeklyQuota(Vehicle vehicle) {
        String vehicleType = vehicle.getVehicleType().name();
        Double baseQuota = WEEKLY_QUOTA_MAP.getOrDefault(vehicleType, 20.0);
        
        // Adjust quota based on engine capacity
        if (vehicle.getEngineCapacity() != null) {
            if (vehicle.getEngineCapacity() > 2000) {
                baseQuota *= 1.5; // 50% more for larger engines
            } else if (vehicle.getEngineCapacity() < 1000) {
                baseQuota *= 0.8; // 20% less for smaller engines
            }
        }
        
        return baseQuota;
    }

    public void assignQuotaToVehicle(Vehicle vehicle) {
        Double weeklyQuota = calculateWeeklyQuota(vehicle);
        vehicle.setWeeklyQuota(weeklyQuota);
        vehicle.setCurrentQuota(weeklyQuota);
        vehicle.setLastQuotaReset(LocalDateTime.now());
        vehicleRepository.save(vehicle);
    }

    public void resetWeeklyQuotas() {
        vehicleRepository.findByIsRegisteredTrue().forEach(vehicle -> {
            LocalDateTime lastReset = vehicle.getLastQuotaReset();
            if (lastReset == null || ChronoUnit.DAYS.between(lastReset, LocalDateTime.now()) >= 7) {
                vehicle.setCurrentQuota(vehicle.getWeeklyQuota());
                vehicle.setLastQuotaReset(LocalDateTime.now());
                vehicleRepository.save(vehicle);
            }
        });
    }

    public boolean canConsumeFuel(Vehicle vehicle, Double requestedQuantity) {
        return vehicle.getCurrentQuota() != null && 
               vehicle.getCurrentQuota() >= requestedQuantity;
    }

    public void consumeQuota(Vehicle vehicle, Double quantity) {
        if (vehicle.getCurrentQuota() != null) {
            vehicle.setCurrentQuota(vehicle.getCurrentQuota() - quantity);
            vehicleRepository.save(vehicle);
        }
    }

    public Double getRemainingQuota(Vehicle vehicle) {
        return vehicle.getCurrentQuota() != null ? vehicle.getCurrentQuota() : 0.0;
    }

    public long getDaysUntilQuotaReset(Vehicle vehicle) {
        if (vehicle.getLastQuotaReset() == null) {
            return 7;
        }
        long daysSinceReset = ChronoUnit.DAYS.between(vehicle.getLastQuotaReset(), LocalDateTime.now());
        return Math.max(0, 7 - daysSinceReset);
    }
}
