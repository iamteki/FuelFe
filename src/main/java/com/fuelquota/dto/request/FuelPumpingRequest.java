package com.fuelquota.dto.request;

import com.fuelquota.entity.enums.FuelType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuelPumpingRequest {
    
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;
    
    @NotNull(message = "Fuel type is required")
    private FuelType fuelType;
    
    @NotNull(message = "Pumped liters is required")
    @DecimalMin(value = "0.01", message = "Pumped liters must be greater than 0")
    private BigDecimal pumpedLiters;
    
    @NotNull(message = "Unit price is required")
    @Positive(message = "Unit price must be positive")
    private BigDecimal unitPrice;
}