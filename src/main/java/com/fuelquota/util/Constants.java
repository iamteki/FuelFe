package com.fuelquota.util;

public class Constants {
    
    private Constants() {
        throw new IllegalStateException("Constants class");
    }
    
    // JWT Constants
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    
    // Regex Patterns
    public static final String VEHICLE_NUMBER_PATTERN = "^([A-Z]{1,3}\\s)?[A-Z]{2,3}-\\d{4}$|^\\d{2,3}-\\d{4}$";
    public static final String NIC_PATTERN = "^([0-9]{9}[vVxX]|[0-9]{12})$";
    public static final String PHONE_PATTERN = "^\\+?[0-9]{10,15}$";
    public static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    
    // Fuel Quota Defaults (in liters)
    public static final double DEFAULT_CAR_QUOTA = 20.0;
    public static final double DEFAULT_VAN_QUOTA = 30.0;
    public static final double DEFAULT_BUS_QUOTA = 100.0;
    public static final double DEFAULT_MOTORCYCLE_QUOTA = 5.0;
    public static final double DEFAULT_THREE_WHEELER_QUOTA = 15.0;
    public static final double DEFAULT_TRUCK_QUOTA = 150.0;
    
    // QR Code Settings
    public static final int QR_CODE_WIDTH = 250;
    public static final int QR_CODE_HEIGHT = 250;
    public static final String QR_CODE_PREFIX = "FQ-";
    
    // Pagination Defaults
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    
    // Date Format
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    
    // Error Messages
    public static final String USER_NOT_FOUND = "User not found";
    public static final String VEHICLE_NOT_FOUND = "Vehicle not found";
    public static final String INVALID_CREDENTIALS = "Invalid username or password";
    public static final String INSUFFICIENT_QUOTA = "Insufficient fuel quota";
    public static final String UNAUTHORIZED_ACCESS = "Unauthorized access";
    
    // Success Messages
    public static final String REGISTRATION_SUCCESS = "Registration successful";
    public static final String LOGIN_SUCCESS = "Login successful";
    public static final String UPDATE_SUCCESS = "Update successful";
    public static final String DELETE_SUCCESS = "Delete successful";
    
    // System Configuration Keys
    public static final String CONFIG_SMS_ENABLED = "sms.enabled";
    public static final String CONFIG_EMAIL_ENABLED = "email.enabled";
    public static final String CONFIG_QUOTA_RESET_DAY = "quota.reset.day";
    public static final String CONFIG_MAX_VEHICLES_PER_OWNER = "max.vehicles.per.owner";
}