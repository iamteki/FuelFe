package com.fuelquota.service.impl;

import com.fuelquota.entity.FuelTransaction;
import com.fuelquota.entity.User;
import com.fuelquota.integration.sms.SMSProvider;
import com.fuelquota.integration.sms.dto.SMSRequest;
import com.fuelquota.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final SMSProvider smsProvider;
    private final JavaMailSender mailSender;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Override
    @Async
    public void sendTransactionNotification(FuelTransaction transaction) {
        try {
            String phoneNumber = transaction.getVehicle().getVehicleOwner().getUser().getPhoneNumber();
            if (phoneNumber == null || phoneNumber.isEmpty()) {
                log.warn("No phone number found for vehicle owner");
                return;
            }

            String message = String.format(
                    "Fuel Quota System: %s liters of %s pumped for vehicle %s at %s on %s. " +
                    "Remaining quota: %s liters. Total amount: Rs. %s",
                    transaction.getPumpedLiters(),
                    transaction.getFuelType(),
                    transaction.getVehicle().getVehicleNumber(),
                    transaction.getFuelStation().getStationName(),
                    transaction.getTransactionDate().format(DATE_FORMATTER),
                    transaction.getFuelQuota().getRemainingQuota(),
                    transaction.getTotalAmount()
            );

            SMSRequest smsRequest = SMSRequest.builder()
                    .to(phoneNumber)
                    .message(message)
                    .build();

            smsProvider.sendSMS(smsRequest);
            log.info("Transaction notification sent to {}", phoneNumber);
            
        } catch (Exception e) {
            log.error("Failed to send transaction notification", e);
            // Fallback to email
            sendTransactionEmail(transaction);
        }
    }

    private void sendTransactionEmail(FuelTransaction transaction) {
        try {
            String email = transaction.getVehicle().getVehicleOwner().getUser().getEmail();
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Fuel Transaction Notification");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "%s liters of %s has been pumped for your vehicle %s at %s on %s.\n" +
                    "Remaining quota: %s liters\n" +
                    "Total amount: Rs. %s\n\n" +
                    "Thank you for using Fuel Quota Management System.",
                    transaction.getVehicle().getVehicleOwner().getFullName(),
                    transaction.getPumpedLiters(),
                    transaction.getFuelType(),
                    transaction.getVehicle().getVehicleNumber(),
                    transaction.getFuelStation().getStationName(),
                    transaction.getTransactionDate().format(DATE_FORMATTER),
                    transaction.getFuelQuota().getRemainingQuota(),
                    transaction.getTotalAmount()
            ));
            
            mailSender.send(message);
            log.info("Transaction email sent to {}", email);
            
        } catch (Exception e) {
            log.error("Failed to send transaction email", e);
        }
    }

    @Override
    @Async
    public void sendRegistrationConfirmation(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Welcome to Fuel Quota Management System");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "Your account has been successfully created.\n" +
                    "Username: %s\n" +
                    "Role: %s\n\n" +
                    "You can now login to the system.\n\n" +
                    "Thank you for registering!",
                    user.getUsername(),
                    user.getUsername(),
                    user.getRole()
            ));
            
            mailSender.send(message);
            log.info("Registration confirmation sent to {}", user.getEmail());
            
        } catch (Exception e) {
            log.error("Failed to send registration confirmation", e);
        }
    }

    @Override
    @Async
    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Password Reset Request");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "You have requested to reset your password.\n" +
                    "Your password reset token is: %s\n\n" +
                    "This token will expire in 1 hour.\n\n" +
                    "If you did not request this, please ignore this email.",
                    user.getUsername(),
                    resetToken
            ));
            
            mailSender.send(message);
            log.info("Password reset email sent to {}", user.getEmail());
            
        } catch (Exception e) {
            log.error("Failed to send password reset email", e);
        }
    }

    @Override
    @Async
    public void sendFuelStationApprovalNotification(User owner, boolean approved) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(owner.getEmail());
            message.setSubject("Fuel Station Registration " + (approved ? "Approved" : "Rejected"));
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "Your fuel station registration has been %s.\n\n" +
                    "%s\n\n" +
                    "Thank you.",
                    owner.getUsername(),
                    approved ? "approved" : "rejected",
                    approved ? "You can now start adding operators and managing fuel transactions." : 
                              "Please contact support for more information."
            ));
            
            mailSender.send(message);
            log.info("Fuel station approval notification sent to {}", owner.getEmail());
            
        } catch (Exception e) {
            log.error("Failed to send fuel station approval notification", e);
        }
    }
}