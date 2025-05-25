package com.fuelquota.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private Long totalUsers;
    private Long totalVehicles;
    private Long totalFuelStations;
    private Long pendingFuelStations;
    private Long totalTransactions;
    private BigDecimal totalFuelPumped;
    private BigDecimal totalRevenue;
    private Long todayTransactions;
    private BigDecimal todayFuelPumped;
    private Long activeOperators;
}