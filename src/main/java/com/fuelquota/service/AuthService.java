package com.fuelquota.service;

import com.fuelquota.dto.request.LoginRequest;
import com.fuelquota.dto.request.RegisterRequest;
import com.fuelquota.dto.response.LoginResponse;
import com.fuelquota.entity.User;

public interface AuthService {
    
    LoginResponse authenticateUser(LoginRequest loginRequest);
    
    User registerUser(RegisterRequest registerRequest);
    
    boolean checkUsernameAvailability(String username);
    
    boolean checkEmailAvailability(String email);
}