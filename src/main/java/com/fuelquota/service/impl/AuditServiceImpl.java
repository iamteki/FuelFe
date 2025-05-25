package com.fuelquota.service.impl;

import com.fuelquota.entity.AuditLog;
import com.fuelquota.entity.User;
import com.fuelquota.repository.AuditLogRepository;
import com.fuelquota.repository.UserRepository;
import com.fuelquota.security.CustomUserDetails;
import com.fuelquota.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    public void logAction(String action, String entityType, Long entityId, Map<String, Object> oldValues, Map<String, Object> newValues) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .oldValues(oldValues)
                    .newValues(newValues)
                    .user(getCurrentUser())
                    .ipAddress(getClientIpAddress())
                    .userAgent(getUserAgent())
                    .build();
            
            auditLogRepository.save(auditLog);
            log.debug("Audit log created: {} on {} with id {}", action, entityType, entityId);
            
        } catch (Exception e) {
            log.error("Failed to create audit log", e);
        }
    }

    @Override
    public void logAction(String action, String entityType, Long entityId) {
        logAction(action, entityType, entityId, null, null);
    }

    @Override
    public void logUserAction(String action) {
        logAction(action, null, null, null, null);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userRepository.findById(userDetails.getId()).orElse(null);
        }
        return null;
    }

    private String getClientIpAddress() {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        } catch (Exception e) {
            return null;
        }
    }

    private String getUserAgent() {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
            return request.getHeader("User-Agent");
        } catch (Exception e) {
            return null;
        }
    }
}