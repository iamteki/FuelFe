package com.fuelquota.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String message;
    private String error;
    private Integer status;
    private String path;
    private LocalDateTime timestamp;
    private Map<String, String> validationErrors;
    
    public static ErrorResponse of(String message, String error, Integer status, String path) {
        return ErrorResponse.builder()
                .message(message)
                .error(error)
                .status(status)
                .path(path)
                .timestamp(LocalDateTime.now())
                .build();
    }
}