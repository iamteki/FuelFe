package com.fuelquota.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuotaResponse {
    private Long id;
    private Long vehicleId;
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private BigDecimal allocatedQuota;
    private BigDecimal remainingQuota;
    private BigDecimal usedQuota;
    private Double usagePercentage;
}