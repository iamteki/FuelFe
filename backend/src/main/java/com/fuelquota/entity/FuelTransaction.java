package com.fuelquota.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "fuel_transactions")
public class FuelTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fuel_station_id")
    private FuelStation fuelStation;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", length = 20)
    private FuelType fuelType;

    @NotNull
    @Positive
    @Column(name = "quantity")
    private Double quantity;

    @NotNull
    @Positive
    @Column(name = "price_per_liter")
    private Double pricePerLiter;

    @NotNull
    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private TransactionStatus status;

    @Size(max = 500)
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private User processedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public FuelTransaction() {}

    public FuelTransaction(Vehicle vehicle, FuelStation fuelStation, FuelType fuelType, 
                          Double quantity, Double pricePerLiter) {
        this.vehicle = vehicle;
        this.fuelStation = fuelStation;
        this.fuelType = fuelType;
        this.quantity = quantity;
        this.pricePerLiter = pricePerLiter;
        this.totalAmount = quantity * pricePerLiter;
        this.status = TransactionStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
        if (totalAmount == null && quantity != null && pricePerLiter != null) {
            totalAmount = quantity * pricePerLiter;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }

    public FuelStation getFuelStation() { return fuelStation; }
    public void setFuelStation(FuelStation fuelStation) { this.fuelStation = fuelStation; }

    public FuelType getFuelType() { return fuelType; }
    public void setFuelType(FuelType fuelType) { this.fuelType = fuelType; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Double getPricePerLiter() { return pricePerLiter; }
    public void setPricePerLiter(Double pricePerLiter) { this.pricePerLiter = pricePerLiter; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public User getProcessedBy() { return processedBy; }
    public void setProcessedBy(User processedBy) { this.processedBy = processedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
