package com.fuelquota.service.impl;

import com.fuelquota.config.JwtTokenProvider;
import com.fuelquota.dto.request.LoginRequest;
import com.fuelquota.dto.request.RegisterRequest;
import com.fuelquota.dto.response.LoginResponse;
import com.fuelquota.entity.User;
import com.fuelquota.entity.VehicleOwner;
import com.fuelquota.entity.enums.UserRole;
import com.fuelquota.exception.BadRequestException;
import com.fuelquota.repository.UserRepository;
import com.fuelquota.repository.VehicleOwnerRepository;
import com.fuelquota.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final VehicleOwnerRepository vehicleOwnerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByUsernameOrEmail(
                loginRequest.getUsernameOrEmail(), 
                loginRequest.getUsernameOrEmail()
        ).orElseThrow(() -> new BadRequestException("User not found"));

        return LoginResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        // Create new user
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(registerRequest.getRole() != null ? registerRequest.getRole() : UserRole.VEHICLE_OWNER)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // If vehicle owner, create vehicle owner profile
        if (user.getRole() == UserRole.VEHICLE_OWNER && registerRequest.getNic() != null) {
            VehicleOwner vehicleOwner = VehicleOwner.builder()
                    .user(user)
                    .nic(registerRequest.getNic())
                    .fullName(registerRequest.getFullName())
                    .address(registerRequest.getAddress())
                    .build();
            vehicleOwnerRepository.save(vehicleOwner);
        }

        log.info("User registered successfully: {}", user.getUsername());
        return user;
    }

    @Override
    public boolean checkUsernameAvailability(String username) {
        return !userRepository.existsByUsername(username);
    }

    @Override
    public boolean checkEmailAvailability(String email) {
        return !userRepository.existsByEmail(email);
    }
}