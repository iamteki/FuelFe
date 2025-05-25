package com.fuelquota.service;

import com.fuelquota.entity.AuditLog;

import java.util.Map;

public interface AuditService {
    void logAction(String action, String entityType, Long entityId, Map<String, Object> oldValues, Map<String, Object> newValues);
    void logAction(String action, String entityType, Long entityId);
    void logUserAction(String action);
}