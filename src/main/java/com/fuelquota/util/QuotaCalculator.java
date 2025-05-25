package com.fuelquota.util;

import com.fuelquota.entity.Vehicle;
import com.fuelquota.entity.enums.VehicleType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class QuotaCalculator {

    @Value("${fuel.quota.car.weekly}")
    private BigDecimal carQuota;

    @Value("${fuel.quota.van.weekly}")
    private BigDecimal vanQuota;

    @Value("${fuel.quota.bus.weekly}")
    private BigDecimal busQuota;

    @Value("${fuel.quota.motorcycle.weekly}")
    private BigDecimal motorcycleQuota;

    @Value("${fuel.quota.three_wheeler.weekly}")
    private BigDecimal threeWheelerQuota;

    @Value("${fuel.quota.truck.weekly}")
    private BigDecimal truckQuota;

    public BigDecimal calculateWeeklyQuota(Vehicle vehicle) {
        VehicleType vehicleType = vehicle.getVehicleType();
        
        switch (vehicleType) {
            case CAR:
                return carQuota;
            case VAN:
                return vanQuota;
            case BUS:
                return busQuota;
            case MOTORCYCLE:
                return motorcycleQuota;
            case THREE_WHEELER:
                return threeWheelerQuota;
            case TRUCK:
                return truckQuota;
            default:
                return BigDecimal.valueOf(20); // Default quota
        }
    }
}