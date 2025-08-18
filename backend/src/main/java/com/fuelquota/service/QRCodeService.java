package com.fuelquota.service;

import com.fuelquota.entity.Vehicle;
import com.fuelquota.repository.VehicleRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.time.LocalDateTime;

@Service
public class QRCodeService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Value("${qr.code.directory:qr-codes/}")
    private String qrCodeDirectory;

    @Value("${qr.code.size:300}")
    private int qrCodeSize;

    public String generateQRCodeForVehicle(Vehicle vehicle) throws WriterException, IOException {
        String qrCodeData = createQRCodeData(vehicle);
        String fileName = "vehicle_" + vehicle.getRegistrationNumber() + "_" + System.currentTimeMillis() + ".png";
        String filePath = qrCodeDirectory + fileName;

        // Create directory if it doesn't exist
        Path directory = FileSystems.getDefault().getPath(qrCodeDirectory);
        if (!directory.toFile().exists()) {
            directory.toFile().mkdirs();
        }

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeData, BarcodeFormat.QR_CODE, qrCodeSize, qrCodeSize);

        Path path = FileSystems.getDefault().getPath(filePath);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);

        // Update vehicle with QR code path
        vehicle.setQrCodePath(filePath);
        vehicleRepository.save(vehicle);

        return filePath;
    }

    private String createQRCodeData(Vehicle vehicle) {
        return String.format(
            "VEHICLE_ID:%d|REG_NO:%s|TYPE:%s|FUEL:%s|QUOTA:%.2f|OWNER:%s|GENERATED:%s",
            vehicle.getId(),
            vehicle.getRegistrationNumber(),
            vehicle.getVehicleType(),
            vehicle.getFuelType(),
            vehicle.getCurrentQuota(),
            vehicle.getOwner().getUsername(),
            LocalDateTime.now().toString()
        );
    }

    public boolean validateQRCode(String qrCodeData, Long vehicleId) {
        try {
            String[] parts = qrCodeData.split("\\|");
            for (String part : parts) {
                if (part.startsWith("VEHICLE_ID:")) {
                    Long extractedId = Long.parseLong(part.substring(11));
                    return extractedId.equals(vehicleId);
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
