package com.fuelquota.service;

import com.fuelquota.dto.response.DashboardStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    DashboardStatsResponse getDashboardStats();
    Page<Object> getAllUsers(Pageable pageable);
    void activateUser(Long userId);
    void deactivateUser(Long userId);
}