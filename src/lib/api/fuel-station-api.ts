// src/lib/api/fuel-station-api.ts
import axiosInstance from './axios-config'
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints'
import { 
  FuelStation,
  FuelStationRegistrationRequest,
  FuelStationResponse,
  FuelStationOperator,
  OperatorRegistrationRequest,
  ApiResponse,
  TransactionResponse
} from '@/types'

export const fuelStationAPI = {
  // Station Management
  register: async (data: FuelStationRegistrationRequest): Promise<FuelStation> => {
    const response = await axiosInstance.post<ApiResponse<FuelStation>>(
      API_ENDPOINTS.FUEL_STATION.REGISTER,
      data
    )
    return response.data.data!
  },

  getMyStation: async (): Promise<FuelStationResponse> => {
    const response = await axiosInstance.get<ApiResponse<FuelStationResponse>>(
      API_ENDPOINTS.FUEL_STATION.MY_STATION
    )
    const station = response.data.data!
    
    // Ensure isApproved is set based on approvedAt if not provided by backend
    if (station && typeof station.isApproved === 'undefined') {
      station.isApproved = !!station.approvedAt
    }
    
    return station
  },

  getStationById: async (id: number): Promise<FuelStationResponse> => {
    const response = await axiosInstance.get<ApiResponse<FuelStationResponse>>(
      API_ENDPOINTS.FUEL_STATION.BY_ID(id)
    )
    return response.data.data!
  },

  getAllStations: async (): Promise<FuelStationResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<FuelStationResponse[]>>(
      API_ENDPOINTS.FUEL_STATION.LIST
    )
    return response.data.data!
  },

  updateStation: async (id: number, data: FuelStationRegistrationRequest): Promise<FuelStation> => {
    const response = await axiosInstance.put<ApiResponse<FuelStation>>(
      API_ENDPOINTS.FUEL_STATION.UPDATE(id),
      data
    )
    return response.data.data!
  },

  deactivateStation: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.FUEL_STATION.DEACTIVATE(id))
  },

  // Profile Management
  updateProfile: async (data: any): Promise<any> => {
    const response = await axiosInstance.put<ApiResponse<any>>(
      '/user/profile',
      data
    )
    return response.data.data!
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<any> => {
    const response = await axiosInstance.put<ApiResponse<any>>(
      '/user/change-password',
      data
    )
    return response.data.data!
  },

  // Operator Management
  registerOperator: async (data: OperatorRegistrationRequest): Promise<FuelStationOperator> => {
    const response = await axiosInstance.post<ApiResponse<FuelStationOperator>>(
      API_ENDPOINTS.FUEL_STATION.OPERATORS.REGISTER,
      data
    )
    return response.data.data!
  },

  getOperators: async (): Promise<FuelStationOperator[]> => {
    const response = await axiosInstance.get<ApiResponse<FuelStationOperator[]>>(
      API_ENDPOINTS.FUEL_STATION.OPERATORS.LIST
    )
    return response.data.data!
  },

  getOperatorById: async (id: number): Promise<FuelStationOperator> => {
    const response = await axiosInstance.get<ApiResponse<FuelStationOperator>>(
      API_ENDPOINTS.FUEL_STATION.OPERATORS.BY_ID(id)
    )
    return response.data.data!
  },

  updateOperator: async (id: number, data: OperatorRegistrationRequest): Promise<FuelStationOperator> => {
    const response = await axiosInstance.put<ApiResponse<FuelStationOperator>>(
      API_ENDPOINTS.FUEL_STATION.OPERATORS.UPDATE(id),
      data
    )
    return response.data.data!
  },

  activateOperator: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.FUEL_STATION.OPERATORS.ACTIVATE(id))
  },

  deactivateOperator: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.FUEL_STATION.OPERATORS.DEACTIVATE(id))
  },

  // Station Stats
  getStationStats: async (): Promise<any> => {
    try {
      // First get the station details
      const station = await fuelStationAPI.getMyStation()
      
      // Get transactions for this station
      const transactions = await axiosInstance.get<ApiResponse<TransactionResponse[]>>(
        API_ENDPOINTS.TRANSACTIONS.BY_FUEL_STATION(station.id)
      )
      
      const transactionData = transactions.data.data || []
      
      // Calculate stats
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      
      const todayTransactions = transactionData.filter(t => 
        new Date(t.transactionDate).toDateString() === today.toDateString()
      )
      
      const monthTransactions = transactionData.filter(t => 
        new Date(t.transactionDate) >= startOfMonth
      )
      
      return {
        totalOperators: station.operatorCount || 0,
        activeOperators: station.operatorCount || 0, // Assuming all are active
        todayTransactions: todayTransactions.length,
        monthlyTransactions: monthTransactions.length,
        todayFuelDispensed: todayTransactions.reduce((sum, t) => sum + Number(t.pumpedLiters), 0),
        monthlyFuelDispensed: monthTransactions.reduce((sum, t) => sum + Number(t.pumpedLiters), 0),
        todayRevenue: todayTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0),
        monthlyRevenue: monthTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0),
        stationStatus: station.isActive ? 'Active' : 'Inactive',
        approvalStatus: station.isApproved ? 'Approved' : 'Pending'
      }
    } catch (error) {
      console.error('Error fetching station stats:', error)
      // Return default stats if error
      return {
        totalOperators: 0,
        activeOperators: 0,
        todayTransactions: 0,
        monthlyTransactions: 0,
        todayFuelDispensed: 0,
        monthlyFuelDispensed: 0,
        todayRevenue: 0,
        monthlyRevenue: 0,
        stationStatus: 'Unknown',
        approvalStatus: 'Unknown'
      }
    }
  },
}