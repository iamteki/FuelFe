import axiosInstance from './axios-config'
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints'
import { ApiResponse, VehicleOwnerStats } from '@/types'

export const vehicleOwnerAPI = {
  getProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.VEHICLE_OWNER.PROFILE)
    return response.data.data
  },

  updateProfile: async (data: any) => {
    const response = await axiosInstance.put(API_ENDPOINTS.VEHICLE_OWNER.UPDATE_PROFILE, data)
    return response.data.data
  },

  getDashboardStats: async (): Promise<VehicleOwnerStats> => {
    const response = await axiosInstance.get<ApiResponse<any>>(
      API_ENDPOINTS.VEHICLE_OWNER.DASHBOARD_STATS
    )
    console.log('Raw API response:', response.data) // Debug log
    
    // The backend returns the data directly or wrapped
    const statsData = response.data.data || response.data
    
    // Map the backend response to our expected format
    return {
      totalVehicles: statsData.totalVehicles || 0,
      verifiedVehicles: statsData.verifiedVehicles || 0,
      monthlyFuelConsumed: statsData.monthlyFuelConsumed || 0,
      monthlyTransactions: statsData.monthlyTransactions || 0,
    }
  },
}