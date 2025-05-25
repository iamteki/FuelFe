package com.fuelquota.service;

import com.fuelquota.dto.response.QuotaResponse;
import com.fuelquota.entity.FuelQuota;
import com.fuelquota.entity.Vehicle;

import java.math.BigDecimal;

public interface QuotaService {
    FuelQuota createWeeklyQuota(Vehicle vehicle);
    FuelQuota getCurrentQuota(Long vehicleId);
    QuotaResponse getCurrentQuotaResponse(Long vehicleId);
    FuelQuota deductQuota(Long vehicleId, BigDecimal amount);
    void resetWeeklyQuotas();
    BigDecimal calculateWeeklyQuota(Vehicle vehicle);
}