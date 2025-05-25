package com.fuelquota.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fuelquota.entity.enums.FuelType;
import com.fuelquota.entity.enums.VehicleType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_owner_id", nullable = false)
    @JsonBackReference
    private VehicleOwner vehicleOwner;

    @Column(name = "vehicle_number", unique = true, nullable = false, length = 20)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false)
    private FuelType fuelType;

    @Column(name = "engine_capacity")
    private Integer engineCapacity;

    @Column(length = 50)
    private String model;

    @Column(length = 50)
    private String make;

    @Column(name = "year_of_manufacture")
    private Integer yearOfManufacture;

    @Column(name = "qr_code", unique = true, columnDefinition = "TEXT")
    private String qrCode;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
}