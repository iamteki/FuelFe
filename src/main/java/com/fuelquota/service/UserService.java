package com.fuelquota.service;

import com.fuelquota.dto.request.PasswordChangeRequest;
import com.fuelquota.dto.request.ProfileUpdateRequest;
import com.fuelquota.entity.User;

public interface UserService {
    
    User getUserById(Long id);
    
    User updateProfile(Long userId, ProfileUpdateRequest request);
    
    void changePassword(Long userId, PasswordChangeRequest request);
}