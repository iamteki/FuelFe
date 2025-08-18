package com.fuelquota.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    @Column(unique = true, name = "registration_number")
    private String registrationNumber;

    @Size(max = 50)
    private String make;

    @Size(max = 50)
    private String model;

    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", length = 30)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", length = 20)
    private FuelType fuelType;

    @Column(name = "engine_capacity")
    private Double engineCapacity;

    @Column(name = "weekly_quota")
    private Double weeklyQuota;

    @Column(name = "current_quota")
    private Double currentQuota;

    @Column(name = "last_quota_reset")
    private LocalDateTime lastQuotaReset;

    @Column(name = "qr_code_path")
    private String qrCodePath;

    @Column(name = "is_registered")
    private Boolean isRegistered = false;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<FuelTransaction> fuelTransactions = new HashSet<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Vehicle() {}

    public Vehicle(String registrationNumber, VehicleType vehicleType, FuelType fuelType) {
        this.registrationNumber = registrationNumber;
        this.vehicleType = vehicleType;
        this.fuelType = fuelType;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getManufactureYear() { return manufactureYear; }
    public void setManufactureYear(Integer manufactureYear) { this.manufactureYear = manufactureYear; }

    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }

    public FuelType getFuelType() { return fuelType; }
    public void setFuelType(FuelType fuelType) { this.fuelType = fuelType; }

    public Double getEngineCapacity() { return engineCapacity; }
    public void setEngineCapacity(Double engineCapacity) { this.engineCapacity = engineCapacity; }

    public Double getWeeklyQuota() { return weeklyQuota; }
    public void setWeeklyQuota(Double weeklyQuota) { this.weeklyQuota = weeklyQuota; }

    public Double getCurrentQuota() { return currentQuota; }
    public void setCurrentQuota(Double currentQuota) { this.currentQuota = currentQuota; }

    public LocalDateTime getLastQuotaReset() { return lastQuotaReset; }
    public void setLastQuotaReset(LocalDateTime lastQuotaReset) { this.lastQuotaReset = lastQuotaReset; }

    public String getQrCodePath() { return qrCodePath; }
    public void setQrCodePath(String qrCodePath) { this.qrCodePath = qrCodePath; }

    public Boolean getIsRegistered() { return isRegistered; }
    public void setIsRegistered(Boolean isRegistered) { this.isRegistered = isRegistered; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public Set<FuelTransaction> getFuelTransactions() { return fuelTransactions; }
    public void setFuelTransactions(Set<FuelTransaction> fuelTransactions) { this.fuelTransactions = fuelTransactions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
