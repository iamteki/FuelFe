package com.fuelquota.util;

import java.util.Random;
import java.util.UUID;

public class StringUtils {
    
    private static final Random RANDOM = new Random();
    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    private StringUtils() {
        throw new IllegalStateException("Utility class");
    }
    
    /**
     * Check if a string is null or empty
     */
    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
    
    /**
     * Check if a string is not null and not empty
     */
    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }
    
    /**
     * Generate a random alphanumeric string
     */
    public static String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }
    
    /**
     * Generate a unique ID
     */
    public static String generateUniqueId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
    
    /**
     * Capitalize first letter
     */
    public static String capitalizeFirst(String str) {
        if (isEmpty(str)) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
    
    /**
     * Format vehicle number (ensure consistent format)
     */
    public static String formatVehicleNumber(String vehicleNumber) {
        if (isEmpty(vehicleNumber)) {
            return vehicleNumber;
        }
        // Remove extra spaces and convert to uppercase
        return vehicleNumber.trim().replaceAll("\\s+", " ").toUpperCase();
    }
    
    /**
     * Mask sensitive information (for display purposes)
     */
    public static String maskString(String str, int visibleChars) {
        if (isEmpty(str) || str.length() <= visibleChars) {
            return str;
        }
        
        int maskLength = str.length() - visibleChars;
        StringBuilder masked = new StringBuilder(str.substring(0, visibleChars));
        
        for (int i = 0; i < maskLength; i++) {
            masked.append("*");
        }
        
        return masked.toString();
    }
    
    /**
     * Mask NIC number (show only last 4 characters)
     */
    public static String maskNIC(String nic) {
        if (isEmpty(nic) || nic.length() <= 4) {
            return nic;
        }
        return maskString(nic, nic.length() - 4);
    }
    
    /**
     * Mask phone number (show only last 4 digits)
     */
    public static String maskPhoneNumber(String phone) {
        if (isEmpty(phone) || phone.length() <= 4) {
            return phone;
        }
        int visibleLength = Math.min(4, phone.length());
        return "*".repeat(phone.length() - visibleLength) + phone.substring(phone.length() - visibleLength);
    }
    
    /**
     * Clean and format phone number
     */
    public static String cleanPhoneNumber(String phone) {
        if (isEmpty(phone)) {
            return phone;
        }
        // Remove all non-digit characters except +
        return phone.replaceAll("[^+\\d]", "");
    }
    
    /**
     * Truncate string to specified length
     */
    public static String truncate(String str, int maxLength) {
        if (isEmpty(str) || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength) + "...";
    }
    
    /**
     * Convert string to title case
     */
    public static String toTitleCase(String str) {
        if (isEmpty(str)) {
            return str;
        }
        
        String[] words = str.trim().split("\\s+");
        StringBuilder titleCase = new StringBuilder();
        
        for (String word : words) {
            if (titleCase.length() > 0) {
                titleCase.append(" ");
            }
            titleCase.append(capitalizeFirst(word));
        }
        
        return titleCase.toString();
    }
}