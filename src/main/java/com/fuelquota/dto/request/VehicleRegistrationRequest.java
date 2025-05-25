package com.fuelquota.dto.request;

import com.fuelquota.entity.enums.FuelType;
import com.fuelquota.entity.enums.VehicleType;
import com.fuelquota.validator.annotation.ValidVehicleNumber;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRegistrationRequest {
    
    @NotBlank(message = "Vehicle number is required")
    @ValidVehicleNumber
    private String vehicleNumber;
    
    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;
    
    @NotNull(message = "Fuel type is required")
    private FuelType fuelType;
    
    @Positive(message = "Engine capacity must be positive")
    private Integer engineCapacity;
    
    @Size(max = 50, message = "Model cannot exceed 50 characters")
    private String model;
    
    @Size(max = 50, message = "Make cannot exceed 50 characters")
    private String make;
    
    @Min(value = 1900, message = "Invalid year of manufacture")
    @Max(value = 2025, message = "Invalid year of manufacture")
    private Integer yearOfManufacture;
}