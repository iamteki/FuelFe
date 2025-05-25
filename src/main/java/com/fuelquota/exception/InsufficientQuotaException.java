package com.fuelquota.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InsufficientQuotaException extends RuntimeException {
    
    public InsufficientQuotaException(String message) {
        super(message);
    }
    
    public InsufficientQuotaException(String message, Throwable cause) {
        super(message, cause);
    }
}