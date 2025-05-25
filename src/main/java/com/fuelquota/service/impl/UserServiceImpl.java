package com.fuelquota.service.impl;

import com.fuelquota.dto.request.PasswordChangeRequest;
import com.fuelquota.dto.request.ProfileUpdateRequest;
import com.fuelquota.entity.User;
import com.fuelquota.exception.BadRequestException;
import com.fuelquota.exception.ResourceNotFoundException;
import com.fuelquota.exception.UnauthorizedException;
import com.fuelquota.repository.UserRepository;
import com.fuelquota.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Override
    @Transactional
    public User updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = getUserById(userId);
        
        // Check if email is being changed and is not taken by another user
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(request.getEmail(), userId)) {
                throw new BadRequestException("Email is already in use by another user");
            }
        }
        
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        
        user = userRepository.save(user);
        log.info("Profile updated for user: {}", user.getUsername());
        
        return user;
    }

    @Override
    @Transactional
    public void changePassword(Long userId, PasswordChangeRequest request) {
        User user = getUserById(userId);
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        
        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        log.info("Password changed for user: {}", user.getUsername());
    }
}