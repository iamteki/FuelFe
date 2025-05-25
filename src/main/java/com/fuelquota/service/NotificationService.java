package com.fuelquota.service;

import com.fuelquota.entity.FuelTransaction;
import com.fuelquota.entity.User;

public interface NotificationService {
    void sendTransactionNotification(FuelTransaction transaction);
    void sendRegistrationConfirmation(User user);
    void sendPasswordResetEmail(User user, String resetToken);
    void sendFuelStationApprovalNotification(User owner, boolean approved);
}