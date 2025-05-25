package com.fuelquota.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow specific origins for web
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://127.0.0.1:3000");
        
        // IMPORTANT: For mobile development, we need to allow all origins
        // In production, you should restrict this
        if (isDevEnvironment()) {
            config.addAllowedOriginPattern("*"); // Allows all origins in dev
        }
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow all methods
        config.addAllowedMethod("*");
        
        // Allow credentials - important for JWT tokens
        config.setAllowCredentials(true);
        
        // How long the browser should cache preflight requests
        config.setMaxAge(3600L);
        
        // Expose headers that the client can access
        config.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Total-Count"
        ));
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
    
    private boolean isDevEnvironment() {
        String profile = System.getProperty("spring.profiles.active", "dev");
        return "dev".equals(profile);
    }
}