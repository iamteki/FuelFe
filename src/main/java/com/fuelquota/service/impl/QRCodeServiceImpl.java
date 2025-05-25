package com.fuelquota.service.impl;

import com.fuelquota.entity.Vehicle;
import com.fuelquota.exception.BadRequestException;
import com.fuelquota.repository.VehicleRepository;
import com.fuelquota.service.QRCodeService;
import com.fuelquota.util.QRCodeGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class QRCodeServiceImpl implements QRCodeService {

    private final VehicleRepository vehicleRepository;
    private final QRCodeGenerator qrCodeGenerator;

    @Override
    public String generateQRCode(Vehicle vehicle) {
        // Generate unique QR code data
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String qrData = String.format("FQ-%s-%s-%s", 
                uniqueId, 
                vehicle.getVehicleNumber().replace(" ", ""),
                vehicle.getId());
        
        log.info("Generated QR code for vehicle {}: {}", vehicle.getVehicleNumber(), qrData);
        return qrData;
    }

    @Override
    public String generateQRCodeImage(String qrData) {
        try {
            return qrCodeGenerator.generateQRCodeImage(qrData);
        } catch (Exception e) {
            log.error("Error generating QR code image", e);
            throw new BadRequestException("Failed to generate QR code image");
        }
    }

    @Override
    public Vehicle parseQRCode(String qrCode) {
        if (!qrCode.startsWith("FQ-")) {
            throw new BadRequestException("Invalid QR code format");
        }
        
        return vehicleRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new BadRequestException("Vehicle not found for this QR code"));
    }
}