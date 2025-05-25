package com.fuelquota.dto.response;

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
public class MobileTransactionResponse {
    private Long transactionId;
    private String vehicleNumber;
    private BigDecimal pumpedLiters;
    private BigDecimal totalAmount;
    private BigDecimal remainingQuota;
    private LocalDateTime transactionDate;
    private Boolean smsSent;
    private String message;
}