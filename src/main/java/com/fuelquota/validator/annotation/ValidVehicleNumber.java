package com.fuelquota.validator.annotation;

import com.fuelquota.validator.VehicleNumberValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = VehicleNumberValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidVehicleNumber {
    String message() default "Invalid vehicle number format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}