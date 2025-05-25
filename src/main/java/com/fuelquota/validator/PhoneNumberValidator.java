package com.fuelquota.validator;

import com.fuelquota.util.ValidationUtils;
import com.fuelquota.validator.annotation.ValidPhoneNumber;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneNumberValidator implements ConstraintValidator<ValidPhoneNumber, String> {

    @Override
    public void initialize(ValidPhoneNumber constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext context) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return true; // Let @NotBlank handle null/empty values
        }
        
        if (!ValidationUtils.isValidPhoneNumber(phoneNumber)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(ValidationUtils.getPhoneNumberErrorMessage())
                    .addConstraintViolation();
            return false;
        }
        
        return true;
    }
}