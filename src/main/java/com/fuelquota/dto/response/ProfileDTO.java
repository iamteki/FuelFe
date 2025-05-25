package com.fuelquota.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private Long id;
    private String fullName;
    private String nic;
    private String address;
    private String email;
    private String phoneNumber;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}