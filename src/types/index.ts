// src/types/index.ts

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  timestamp?: string
}

// Auth types
export interface LoginRequest {
  usernameOrEmail: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  phoneNumber: string
  role: 'VEHICLE_OWNER' | 'FUEL_STATION_OWNER' | 'ADMIN'
  nic?: string
  fullName?: string
  address?: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  userId: number
  username: string
  email: string
  role: 'VEHICLE_OWNER' | 'FUEL_STATION_OWNER' | 'ADMIN' | 'FUEL_STATION_OPERATOR'
}

// Vehicle types
export interface Vehicle {
  id: number
  vehicleNumber: string
  vehicleType: 'CAR' | 'VAN' | 'BUS' | 'MOTORCYCLE' | 'THREE_WHEELER' | 'TRUCK'
  fuelType: 'PETROL' | 'DIESEL'
  engineCapacity?: number
  model?: string
  make?: string
  yearOfManufacture?: number
  qrCode: string
  isVerified: boolean
  verifiedAt?: string
  createdAt: string
  updatedAt: string
}

export interface VehicleRegistrationRequest {
  vehicleNumber: string
  vehicleType: string
  fuelType: string
  engineCapacity?: number
  model?: string
  make?: string
  yearOfManufacture?: number
}

export interface VehicleResponse extends Vehicle {
  ownerName: string
  currentQuota?: FuelQuota
}

// Fuel Station types
export interface FuelStation {
  id: number
  registrationNumber: string
  stationName: string
  address: string
  district?: string
  province?: string
  latitude?: number
  longitude?: number
  contactNumber?: string
  isActive: boolean
  approvedBy?: number
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface FuelStationRegistrationRequest {
  registrationNumber: string
  stationName: string
  address: string
  district?: string
  province?: string
  latitude?: number
  longitude?: number
  contactNumber?: string
}

export interface FuelStationResponse extends FuelStation {
  ownerName: string
  ownerEmail?: string
  ownerPhoneNumber?: string
  operatorCount?: number
  isApproved?: boolean
}

// Operator types
export interface FuelStationOperator {
  id: number
  employeeId: string
  fullName: string
  fuelStation: FuelStation
  isActive: boolean
  createdAt: string
  user?: {
    id: number
    username: string
    email: string
    phoneNumber?: string
  }
}

export interface OperatorRegistrationRequest {
  username: string
  email: string
  password: string
  phoneNumber: string
  employeeId: string
  fullName: string
}

// Transaction types
export interface FuelTransaction {
  id: number
  vehicle: Vehicle
  fuelStation: FuelStation
  operator: FuelStationOperator
  fuelQuota: FuelQuota
  pumpedLiters: number
  fuelType: 'PETROL' | 'DIESEL'
  unitPrice?: number
  totalAmount?: number
  transactionDate: string
  smsSent: boolean
  smsSentAt?: string
}

export interface TransactionResponse {
  id: number
  vehicleNumber: string
  vehicleName: string
  fuelStationName: string
  operatorName: string
  pumpedLiters: number
  fuelType: string
  unitPrice: number
  totalAmount: number
  transactionDate: string
  smsSent: boolean
}

export interface FuelPumpingRequest {
  vehicleId: number
  pumpedLiters: number
  unitPrice: number
}

// Quota types
export interface FuelQuota {
  id: number
  vehicleId: number
  weekStartDate: string
  weekEndDate: string
  allocatedQuota: number
  remainingQuota: number
  createdAt: string
}

export interface QuotaResponse {
  quotaId: number
  vehicleId: number
  weekStartDate: string
  weekEndDate: string
  allocatedQuota: number
  remainingQuota: number
  usedQuota: number
  percentageUsed: number
}

// QR Code types
export interface QRCodeResponse {
  vehicleId: number
  vehicleNumber: string
  qrCode: string
  qrImage: string
}

// Dashboard types
export interface DashboardStatsResponse {
  totalUsers: number
  totalVehicles: number
  totalFuelStations: number
  totalTransactions: number
  todayTransactions: number
  totalFuelDispensed: number
  pendingApprovals?: number
  activeOperators: number
  pendingFuelStations: number
  totalFuelPumped: number
  totalRevenue: number
  todayFuelPumped: number
}

export interface VehicleOwnerStats {
  totalVehicles: number
  verifiedVehicles: number
  monthlyFuelConsumed: number
  monthlyTransactions: number
}

// Mobile API types
export interface MobileVehicleResponse {
  vehicleId: number
  vehicleNumber: string
  vehicleType: string
  fuelType: string
  ownerName: string
  currentQuota?: QuotaResponse
  isVerified: boolean
  canPumpFuel: boolean
}

export interface MobileTransactionResponse {
  transactionId: number
  vehicleNumber: string
  pumpedLiters: number
  totalAmount: number
  remainingQuota: number
  transactionDate: string
  smsSent: boolean
  message: string
}