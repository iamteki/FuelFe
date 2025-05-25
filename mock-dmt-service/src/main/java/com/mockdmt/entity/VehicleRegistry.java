package com.mockdmt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_registry")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRegistry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_number", unique = true, nullable = false, length = 20)
    private String vehicleNumber;

    @Column(name = "owner_nic", nullable = false, length = 20)
    private String ownerNic;

    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Column(name = "vehicle_type", length = 50)
    private String vehicleType;

    @Column(name = "fuel_type", length = 20)
    private String fuelType;

    @Column(name = "engine_capacity")
    private Integer engineCapacity;

    @Column(length = 50)
    private String make;

    @Column(length = 50)
    private String model;

    @Column(name = "year_of_manufacture")
    private Integer yearOfManufacture;

    @Column(name = "chassis_number", length = 50)
    private String chassisNumber;

    @Column(name = "engine_number", length = 50)
    private String engineNumber;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}