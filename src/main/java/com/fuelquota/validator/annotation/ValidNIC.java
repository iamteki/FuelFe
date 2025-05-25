package com.fuelquota.validator.annotation;

import com.fuelquota.validator.NICValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = NICValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidNIC {
    String message() default "Invalid NIC format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}