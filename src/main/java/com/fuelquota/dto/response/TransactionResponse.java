package com.fuelquota.dto.response;

import com.fuelquota.entity.enums.FuelType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private Long vehicleId;
    private String vehicleNumber;
    private String vehicleOwnerName;
    private Long fuelStationId;
    private String fuelStationName;
    private String operatorName;
    private BigDecimal pumpedLiters;
    private FuelType fuelType;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private LocalDateTime transactionDate;
    private Boolean smsSent;
    private BigDecimal remainingQuota;
}