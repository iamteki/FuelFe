package com.fuelquota.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "fuel_stations")
public class FuelStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 20)
    @Column(unique = true, name = "station_code")
    private String stationCode;

    @Size(max = 200)
    private String address;

    @Size(max = 50)
    private String city;

    @Size(max = 50)
    private String province;

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 100)
    private String email;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "petrol_stock")
    private Double petrolStock = 0.0;

    @Column(name = "diesel_stock")
    private Double dieselStock = 0.0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "operating_hours")
    private String operatingHours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @OneToMany(mappedBy = "fuelStation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<FuelTransaction> fuelTransactions = new HashSet<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public FuelStation() {}

    public FuelStation(String name, String stationCode, String address) {
        this.name = name;
        this.stationCode = stationCode;
        this.address = address;
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

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStationCode() { return stationCode; }
    public void setStationCode(String stationCode) { this.stationCode = stationCode; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getPetrolStock() { return petrolStock; }
    public void setPetrolStock(Double petrolStock) { this.petrolStock = petrolStock; }

    public Double getDieselStock() { return dieselStock; }
    public void setDieselStock(Double dieselStock) { this.dieselStock = dieselStock; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public User getManager() { return manager; }
    public void setManager(User manager) { this.manager = manager; }

    public Set<FuelTransaction> getFuelTransactions() { return fuelTransactions; }
    public void setFuelTransactions(Set<FuelTransaction> fuelTransactions) { this.fuelTransactions = fuelTransactions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
