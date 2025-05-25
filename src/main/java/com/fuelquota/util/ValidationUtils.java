package com.fuelquota.util;

import java.util.regex.Pattern;

public class ValidationUtils {
    
    private static final Pattern VEHICLE_NUMBER_PATTERN = Pattern.compile(Constants.VEHICLE_NUMBER_PATTERN);
    private static final Pattern NIC_PATTERN = Pattern.compile(Constants.NIC_PATTERN);
    private static final Pattern PHONE_PATTERN = Pattern.compile(Constants.PHONE_PATTERN);
    private static final Pattern EMAIL_PATTERN = Pattern.compile(Constants.EMAIL_PATTERN);
    
    private ValidationUtils() {
        throw new IllegalStateException("Utility class");
    }
    
    /**
     * Validate vehicle number format
     */
    public static boolean isValidVehicleNumber(String vehicleNumber) {
        if (StringUtils.isEmpty(vehicleNumber)) {
            return false;
        }
        return VEHICLE_NUMBER_PATTERN.matcher(vehicleNumber.trim()).matches();
    }
    
    /**
     * Validate NIC format (Sri Lankan)
     */
    public static boolean isValidNIC(String nic) {
        if (StringUtils.isEmpty(nic)) {
            return false;
        }
        return NIC_PATTERN.matcher(nic.trim()).matches();
    }
    
    /**
     * Validate phone number format
     */
    public static boolean isValidPhoneNumber(String phoneNumber) {
        if (StringUtils.isEmpty(phoneNumber)) {
            return false;
        }
        return PHONE_PATTERN.matcher(phoneNumber.trim()).matches();
    }
    
    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        if (StringUtils.isEmpty(email)) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }
    
    /**
     * Validate password strength
     */
    public static boolean isValidPassword(String password) {
        if (StringUtils.isEmpty(password)) {
            return false;
        }
        // At least 6 characters
        return password.length() >= 6;
    }
    
    /**
     * Validate positive number
     */
    public static boolean isPositiveNumber(Number number) {
        return number != null && number.doubleValue() > 0;
    }
    
    /**
     * Validate year
     */
    public static boolean isValidYear(Integer year) {
        if (year == null) {
            return false;
        }
        int currentYear = java.time.Year.now().getValue();
        return year >= 1900 && year <= currentYear;
    }
    
    /**
     * Validate engine capacity
     */
    public static boolean isValidEngineCapacity(Integer capacity) {
        return capacity != null && capacity > 0 && capacity <= 10000;
    }
    
    /**
     * Validate fuel amount
     */
    public static boolean isValidFuelAmount(Double amount) {
        return amount != null && amount > 0 && amount <= 1000;
    }
    
    /**
     * Get validation error message for vehicle number
     */
    public static String getVehicleNumberErrorMessage() {
        return "Invalid vehicle number format. Expected format: WP CAB-1234 or 252-1234";
    }
    
    /**
     * Get validation error message for NIC
     */
    public static String getNICErrorMessage() {
        return "Invalid NIC format. Expected format: 9 digits followed by V/X or 12 digits";
    }
    
    /**
     * Get validation error message for phone number
     */
    public static String getPhoneNumberErrorMessage() {
        return "Invalid phone number format. Should be 10-15 digits, optionally starting with +";
    }
}