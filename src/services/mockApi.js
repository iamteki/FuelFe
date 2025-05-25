// src/services/mockApi.js
const mockVehicles = {
  QR123456: {
    id: "QR123456",
    vehicleNumber: "ABC-1234",
    ownerName: "John Doe",
    ownerPhone: "+94771234567",
    vehicleType: "Car",
    quotaBalance: 20.5,
    maxQuota: 40.0,
    lastPumpDate: "2024-05-20",
    status: "active",
  },
  QR123457: {
    id: "QR123457",
    vehicleNumber: "XYZ-5678",
    ownerName: "Jane Smith",
    ownerPhone: "+94779876543",
    vehicleType: "Motorcycle",
    quotaBalance: 0,
    maxQuota: 15.0,
    lastPumpDate: "2024-05-22",
    status: "active",
  },
  QR123458: {
    id: "QR123458",
    vehicleNumber: "DEF-9012",
    ownerName: "Bob Wilson",
    ownerPhone: "+94775555555",
    vehicleType: "Van",
    quotaBalance: 35.5,
    maxQuota: 60.0,
    lastPumpDate: "2024-05-18",
    status: "active",
  },
};

export const mockApi = {
  // Simulate login
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          credentials.username === "operator" &&
          credentials.password === "password"
        ) {
          resolve({
            success: true,
            token: "mock_jwt_token",
            user: {
              id: "1",
              name: "Station Operator",
              stationId: "ST001",
              stationName: "Main Street Fuel Station",
            },
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  },

  // Get vehicle details by QR code
  getVehicleByQR: async (qrCode) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const vehicle = mockVehicles[qrCode];
        if (vehicle) {
          resolve({
            success: true,
            data: vehicle,
          });
        } else {
          reject(new Error("Vehicle not found"));
        }
      }, 500);
    });
  },

  // Record fuel pumping
  recordFuelPump: async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { vehicleId, amount } = data;
        const vehicle = mockVehicles[vehicleId];

        if (!vehicle) {
          reject(new Error("Vehicle not found"));
          return;
        }

        if (amount > vehicle.quotaBalance) {
          reject(new Error("Insufficient quota balance"));
          return;
        }

        // Update mock data
        vehicle.quotaBalance -= amount;
        vehicle.lastPumpDate = new Date().toISOString().split("T")[0];

        resolve({
          success: true,
          data: {
            transactionId: `TXN${Date.now()}`,
            vehicleNumber: vehicle.vehicleNumber,
            pumpedAmount: amount,
            remainingQuota: vehicle.quotaBalance,
            timestamp: new Date().toISOString(),
          },
        });
      }, 1000);
    });
  },
};
