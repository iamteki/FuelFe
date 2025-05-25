package com.fuelquota.controller;

import com.fuelquota.dto.response.ApiResponse;
import com.fuelquota.dto.response.QRCodeResponse;
import com.fuelquota.dto.response.VehicleResponse;
import com.fuelquota.entity.Vehicle;
import com.fuelquota.service.QRCodeService;
import com.fuelquota.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/qr")
@RequiredArgsConstructor
public class QRCodeController {

    private final QRCodeService qrCodeService;
    private final VehicleService vehicleService;

    @GetMapping("/generate/{vehicleId}")
    public ResponseEntity<ApiResponse<QRCodeResponse>> generateQRCode(@PathVariable Long vehicleId) {
        VehicleResponse vehicle = vehicleService.getVehicleById(vehicleId);
        String qrImage = qrCodeService.generateQRCodeImage(vehicle.getQrCode());
        
        QRCodeResponse response = QRCodeResponse.builder()
                .vehicleId(vehicleId)
                .vehicleNumber(vehicle.getVehicleNumber())
                .qrCode(vehicle.getQrCode())
                .qrImage(qrImage)
                .build();
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/scan")
    public ResponseEntity<ApiResponse<VehicleResponse>> scanQRCode(@RequestParam String qrCode) {
        Vehicle vehicle = qrCodeService.parseQRCode(qrCode);
        VehicleResponse response = vehicleService.getVehicleById(vehicle.getId());
        return ResponseEntity.ok(ApiResponse.success("QR code scanned successfully", response));
    }
}