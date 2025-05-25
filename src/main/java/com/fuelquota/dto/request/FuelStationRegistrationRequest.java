package com.fuelquota.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuelStationRegistrationRequest {
    
    @NotBlank(message = "Registration number is required")
    @Size(max = 50, message = "Registration number cannot exceed 50 characters")
    private String registrationNumber;
    
    @NotBlank(message = "Station name is required")
    @Size(max = 100, message = "Station name cannot exceed 100 characters")
    private String stationName;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @Size(max = 50, message = "District cannot exceed 50 characters")
    private String district;
    
    @Size(max = 50, message = "Province cannot exceed 50 characters")
    private String province;
    
    @DecimalMin(value = "-90.0", message = "Invalid latitude")
    @DecimalMax(value = "90.0", message = "Invalid latitude")
    private BigDecimal latitude;
    
    @DecimalMin(value = "-180.0", message = "Invalid longitude")
    @DecimalMax(value = "180.0", message = "Invalid longitude")
    private BigDecimal longitude;
    
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Contact number should be valid")
    private String contactNumber;
}