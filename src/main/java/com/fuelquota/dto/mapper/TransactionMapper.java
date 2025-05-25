package com.fuelquota.dto.mapper;

import com.fuelquota.dto.response.TransactionResponse;
import com.fuelquota.entity.FuelTransaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public TransactionResponse toResponse(FuelTransaction transaction) {
        if (transaction == null) {
            return null;
        }

        return TransactionResponse.builder()
                .id(transaction.getId())
                .vehicleId(transaction.getVehicle().getId())
                .vehicleNumber(transaction.getVehicle().getVehicleNumber())
                .vehicleOwnerName(transaction.getVehicle().getVehicleOwner().getFullName())
                .fuelStationId(transaction.getFuelStation().getId())
                .fuelStationName(transaction.getFuelStation().getStationName())
                .operatorName(transaction.getOperator().getFullName())
                .pumpedLiters(transaction.getPumpedLiters())
                .fuelType(transaction.getFuelType())
                .unitPrice(transaction.getUnitPrice())
                .totalAmount(transaction.getTotalAmount())
                .transactionDate(transaction.getTransactionDate())
                .smsSent(transaction.getSmsSent())
                .remainingQuota(transaction.getFuelQuota().getRemainingQuota())
                .build();
    }
}