// src/lib/api/admin-api.ts
import axiosInstance from './axios-config'
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints'
import { 
  DashboardStatsResponse,
  FuelStationResponse,
  FuelStation,
  ApiResponse 
} from '@/types'

export const adminAPI = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await axiosInstance.get<ApiResponse<DashboardStatsResponse>>(
      API_ENDPOINTS.ADMIN.DASHBOARD_STATS
    )
    return response.data.data!
  },

  // Fuel Station Management
  getPendingFuelStations: async (): Promise<FuelStationResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<FuelStationResponse[]>>(
      API_ENDPOINTS.ADMIN.FUEL_STATIONS.PENDING
    )
    return response.data.data!
  },

  approveFuelStation: async (id: number): Promise<FuelStation> => {
    const response = await axiosInstance.post<ApiResponse<FuelStation>>(
      API_ENDPOINTS.ADMIN.FUEL_STATIONS.APPROVE(id)
    )
    return response.data.data!
  },

  rejectFuelStation: async (id: number): Promise<FuelStation> => {
    const response = await axiosInstance.post<ApiResponse<FuelStation>>(
      API_ENDPOINTS.ADMIN.FUEL_STATIONS.REJECT(id)
    )
    return response.data.data!
  },

  // User Management
  getAllUsers: async (page = 0, size = 10): Promise<any> => {
    const response = await axiosInstance.get<ApiResponse<any>>(
      `${API_ENDPOINTS.ADMIN.USERS.LIST}?page=${page}&size=${size}`
    )
    return response.data.data!
  },

  activateUser: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ADMIN.USERS.ACTIVATE(id))
  },

  deactivateUser: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ADMIN.USERS.DEACTIVATE(id))
  },

  // Reports
  getTransactionReport: async (startDate?: string, endDate?: string): Promise<any> => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    const response = await axiosInstance.get<ApiResponse<any>>(
      `${API_ENDPOINTS.ADMIN.REPORTS.TRANSACTIONS}?${params.toString()}`
    )
    return response.data.data!
  },

  getFuelConsumptionReport: async (period = 'month'): Promise<any> => {
    const response = await axiosInstance.get<ApiResponse<any>>(
      `${API_ENDPOINTS.ADMIN.REPORTS.FUEL_CONSUMPTION}?period=${period}`
    )
    return response.data.data!
  },
}