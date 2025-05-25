// src/utils/constants.js


const LOCAL_IP = "192.168.1.101"; 

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? `http://${LOCAL_IP}:8080/api/mobile/api` // Development - includes /api context path
  : "https://api.yourproductiondomain.com/api/mobile/api"; // Production

export const VEHICLE_TYPES = {
  CAR: "Car",
  MOTORCYCLE: "Motorcycle",
  VAN: "Van",
  TRUCK: "Truck",
  BUS: "Bus",
};

export const VEHICLE_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  BLOCKED: "blocked",
};

export const FUEL_TYPES = {
  PETROL: "PETROL",
  DIESEL: "DIESEL",
};

export const MAX_FUEL_AMOUNTS = {
  [VEHICLE_TYPES.MOTORCYCLE]: 15,
  [VEHICLE_TYPES.CAR]: 40,
  [VEHICLE_TYPES.VAN]: 60,
  [VEHICLE_TYPES.TRUCK]: 100,
  [VEHICLE_TYPES.BUS]: 150,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  SETTINGS: "appSettings",
};

// API Timeouts
export const API_TIMEOUT = 30000; // 30 seconds

// Fuel Prices (can be fetched from API later)
export const FUEL_PRICES = {
  PETROL: 450.00,
  DIESEL: 400.00,
};