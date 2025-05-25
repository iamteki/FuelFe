package com.fuelquota.controller;

import com.fuelquota.dto.request.UpdateProfileRequest;
import com.fuelquota.dto.response.ApiResponse;
import com.fuelquota.dto.response.ProfileDTO;
import com.fuelquota.entity.User;
import com.fuelquota.entity.VehicleOwner;
import com.fuelquota.security.CustomUserDetails;
import com.fuelquota.service.VehicleOwnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vehicle-owner")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VEHICLE_OWNER')")
public class VehicleOwnerController {

    private final VehicleOwnerService vehicleOwnerService;

@GetMapping("/profile")
public ResponseEntity<ApiResponse<ProfileDTO>> getMyProfile(
        @AuthenticationPrincipal CustomUserDetails currentUser) {
    VehicleOwner profile = vehicleOwnerService.getVehicleOwnerByUserId(currentUser.getId());
    User user = profile.getUser();
    
    ProfileDTO profileDTO = ProfileDTO.builder()
        .id(profile.getId())
        .fullName(profile.getFullName())
        .nic(profile.getNic())
        .address(profile.getAddress())
        .email(user.getEmail())
        .phoneNumber(user.getPhoneNumber())
        .username(user.getUsername())
        .createdAt(profile.getCreatedAt() != null ? profile.getCreatedAt() : user.getCreatedAt())
        .updatedAt(profile.getUpdatedAt() != null ? profile.getUpdatedAt() : user.getUpdatedAt())
        .build();
        
    return ResponseEntity.ok(ApiResponse.success(profileDTO));
}

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<VehicleOwner>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody UpdateProfileRequest request) {
        VehicleOwner updated = vehicleOwnerService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Object>> getDashboardStats(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        var stats = vehicleOwnerService.getDashboardStats(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}