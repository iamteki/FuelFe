package com.fuelquota.integration.dmt;

import com.fuelquota.integration.dmt.dto.VehicleVerificationRequest;
import com.fuelquota.integration.dmt.dto.VehicleVerificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DMTClient {

    private final RestTemplate restTemplate;

    @Value("${dmt.service.url}")
    private String dmtServiceUrl;

    public VehicleVerificationResponse verifyVehicle(String vehicleNumber, String ownerNic) {
        try {
            String url = dmtServiceUrl + "/verify";
            
            VehicleVerificationRequest request = VehicleVerificationRequest.builder()
                    .vehicleNumber(vehicleNumber)
                    .ownerNic(ownerNic)
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<VehicleVerificationRequest> entity = new HttpEntity<>(request, headers);
            
            VehicleVerificationResponse response = restTemplate.postForObject(
                    url, entity, VehicleVerificationResponse.class);
            
            log.info("DMT verification response for vehicle {}: {}", vehicleNumber, response.isValid());
            return response;
            
        } catch (Exception e) {
            log.error("Error verifying vehicle with DMT: ", e);
            return VehicleVerificationResponse.builder()
                    .isValid(false)
                    .message("Unable to verify vehicle at this time")
                    .build();
        }
    }
}