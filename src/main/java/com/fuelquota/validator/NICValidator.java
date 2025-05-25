package com.fuelquota.validator;

import com.fuelquota.util.ValidationUtils;
import com.fuelquota.validator.annotation.ValidNIC;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NICValidator implements ConstraintValidator<ValidNIC, String> {

    @Override
    public void initialize(ValidNIC constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String nic, ConstraintValidatorContext context) {
        if (nic == null) {
            return true; // Let @NotBlank handle null values
        }
        
        if (!ValidationUtils.isValidNIC(nic)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(ValidationUtils.getNICErrorMessage())
                    .addConstraintViolation();
            return false;
        }
        
        return true;
    }
}