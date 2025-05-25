package com.fuelquota.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuelStationResponse {
    private Long id;
    private String registrationNumber;
    private String stationName;
    private String address;
    private String district;
    private String province;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String contactNumber;
    private Boolean isActive;
    private Boolean isApproved;
    private LocalDateTime approvedAt;
    private String approvedBy;
    private LocalDateTime createdAt;
    private String ownerName;
    private String ownerEmail;
    private String ownerPhoneNumber;  // Add this field
    private Integer operatorCount;
}