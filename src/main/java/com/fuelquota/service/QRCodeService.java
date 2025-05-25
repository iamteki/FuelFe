package com.fuelquota.service;

import com.fuelquota.entity.Vehicle;

public interface QRCodeService {
    String generateQRCode(Vehicle vehicle);
    String generateQRCodeImage(String qrData);
    Vehicle parseQRCode(String qrCode);
}