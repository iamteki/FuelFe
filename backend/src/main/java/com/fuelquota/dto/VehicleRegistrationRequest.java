package com.fuelquota.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class VehicleRegistrationRequest {
    @NotBlank
    @Size(max = 20)
    private String registrationNumber;

    @Size(max = 50)
    private String make;

    @Size(max = 50)
    private String model;

    private Integer manufactureYear;

    @NotBlank
    private String vehicleType;

    @NotBlank
    private String fuelType;

    private Double engineCapacity;

    // Constructors
    public VehicleRegistrationRequest() {}

    // Getters and Setters
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getManufactureYear() { return manufactureYear; }
    public void setManufactureYear(Integer manufactureYear) { this.manufactureYear = manufactureYear; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public Double getEngineCapacity() { return engineCapacity; }
    public void setEngineCapacity(Double engineCapacity) { this.engineCapacity = engineCapacity; }
}
