package com.fuelquota.config;

import com.fuelquota.security.CustomUserDetailsService;
import com.fuelquota.security.JwtAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                // Allow localhost and IP addresses for development
                corsConfig.setAllowedOriginPatterns(java.util.List.of(
                    "http://localhost:*",
                    "http://127.0.0.1:*",
                    "http://192.168.*.*:*",
                    "http://10.*.*.*:*",
                    "http://172.16.*.*:*",
                    "http://172.17.*.*:*",
                    "http://172.18.*.*:*",
                    "http://172.19.*.*:*",
                    "http://172.20.*.*:*",
                    "http://172.21.*.*:*",
                    "http://172.22.*.*:*",
                    "http://172.23.*.*:*",
                    "http://172.24.*.*:*",
                    "http://172.25.*.*:*",
                    "http://172.26.*.*:*",
                    "http://172.27.*.*:*",
                    "http://172.28.*.*:*",
                    "http://172.29.*.*:*",
                    "http://172.30.*.*:*",
                    "http://172.31.*.*:*"
                ));
                corsConfig.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                corsConfig.setAllowedHeaders(java.util.List.of("*"));
                corsConfig.setAllowCredentials(true);
                corsConfig.setMaxAge(3600L);
                corsConfig.setExposedHeaders(java.util.List.of("Authorization", "Content-Type"));
                return corsConfig;
            }))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(unauthorizedHandler)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(authz -> authz
                // Public endpoints - no authentication required
                // Note: No need to prefix with /api as Spring Security handles context path
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/health/**").permitAll()
                .requestMatchers("/mobile/api/auth/**").permitAll()
                .requestMatchers("/mobile/api/health").permitAll()
                .requestMatchers("/swagger-ui/**", "/api-docs/**", "/v3/api-docs/**").permitAll()
                
                // Admin only endpoints
                .requestMatchers("/admin/**").hasRole("ADMIN")
                
                // Fuel Station Owner endpoints
                .requestMatchers("/fuel-station/register").hasRole("FUEL_STATION_OWNER")
                .requestMatchers("/fuel-station/my-station").hasRole("FUEL_STATION_OWNER")
                .requestMatchers("/fuel-station/operators/**").hasRole("FUEL_STATION_OWNER")
                .requestMatchers("/fuel-station/{id}").hasAnyRole("FUEL_STATION_OWNER", "ADMIN")
                .requestMatchers("/fuel-station/**").permitAll() // GET endpoints for viewing stations
                
                // Vehicle Owner endpoints
                .requestMatchers("/vehicle-owner/**").hasRole("VEHICLE_OWNER")
                
                // Fuel Station Operator endpoints
                .requestMatchers("/transactions/scan-qr").hasRole("FUEL_STATION_OPERATOR")
                .requestMatchers("/transactions/pump-fuel").hasRole("FUEL_STATION_OPERATOR")
                .requestMatchers("/transactions/my-transactions").hasRole("FUEL_STATION_OPERATOR")
                .requestMatchers("/mobile/api/scan-qr").hasRole("FUEL_STATION_OPERATOR")
                .requestMatchers("/mobile/api/pump-fuel").hasRole("FUEL_STATION_OPERATOR")
                .requestMatchers("/mobile/api/operator/**").hasRole("FUEL_STATION_OPERATOR")
                .requestMatchers("/mobile/api/vehicle/**").hasRole("FUEL_STATION_OPERATOR")
                
                // Transaction endpoints with specific roles
                .requestMatchers("/transactions/fuel-station/**").hasAnyRole("FUEL_STATION_OWNER", "ADMIN")
                .requestMatchers("/transactions/vehicle/**").authenticated() // Any authenticated user can view
                .requestMatchers("/transactions/{id}").authenticated()
                
                // QR Code endpoints - authenticated users
                .requestMatchers("/qr/**").authenticated()
                
                // Report endpoints
                .requestMatchers("/reports/fuel-consumption").hasRole("ADMIN")
                .requestMatchers("/reports/**").hasAnyRole("ADMIN", "FUEL_STATION_OWNER")
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}