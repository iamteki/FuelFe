package com.fuelquota.validator;

import com.fuelquota.validator.annotation.ValidVehicleNumber;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class VehicleNumberValidator implements ConstraintValidator<ValidVehicleNumber, String> {

    // Sri Lankan vehicle number format: WP CAB-1234 or 252-1234
    private static final String VEHICLE_NUMBER_PATTERN = 
            "^([A-Z]{1,3}\\s)?[A-Z]{2,3}-\\d{4}$|^\\d{2,3}-\\d{4}$";

    @Override
    public void initialize(ValidVehicleNumber constraintAnnotation) {
    }

    @Override
    public boolean isValid(String vehicleNumber, ConstraintValidatorContext context) {
        if (vehicleNumber == null) {
            return true; // Let @NotBlank handle null values
        }
        return vehicleNumber.matches(VEHICLE_NUMBER_PATTERN);
    }
}