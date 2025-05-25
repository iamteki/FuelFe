package com.fuelquota.controller;

import com.fuelquota.dto.request.LoginRequest;
import com.fuelquota.dto.request.RegisterRequest;
import com.fuelquota.dto.response.ApiResponse;
import com.fuelquota.dto.response.LoginResponse;
import com.fuelquota.entity.User;
import com.fuelquota.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("User logged in successfully", loginResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = authService.registerUser(registerRequest);
        return new ResponseEntity<>(
                ApiResponse.success("User registered successfully", user), 
                HttpStatus.CREATED
        );
    }

    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Boolean>> checkUsernameAvailability(@RequestParam String username) {
        boolean isAvailable = authService.checkUsernameAvailability(username);
        return ResponseEntity.ok(ApiResponse.success(isAvailable));
    }

    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Boolean>> checkEmailAvailability(@RequestParam String email) {
        boolean isAvailable = authService.checkEmailAvailability(email);
        return ResponseEntity.ok(ApiResponse.success(isAvailable));
    }
}