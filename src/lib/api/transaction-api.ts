import axiosInstance from './axios-config'
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints'
import { 
  TransactionResponse,
  ApiResponse 
} from '@/types'

export const transactionAPI = {
  getTransactionsByVehicle: async (vehicleId: number): Promise<TransactionResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<TransactionResponse[]>>(
      API_ENDPOINTS.TRANSACTIONS.BY_VEHICLE(vehicleId)
    )
    return response.data.data!
  },

  getTransactionById: async (id: number): Promise<TransactionResponse> => {
    const response = await axiosInstance.get<ApiResponse<TransactionResponse>>(
      API_ENDPOINTS.TRANSACTIONS.BY_ID(id)
    )
    return response.data.data!
  },

  getMyTransactions: async (): Promise<TransactionResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<TransactionResponse[]>>(
      API_ENDPOINTS.TRANSACTIONS.MY_TRANSACTIONS
    )
    return response.data.data!
  },

  getTransactionsByFuelStation: async (stationId: number): Promise<TransactionResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<TransactionResponse[]>>(
      API_ENDPOINTS.TRANSACTIONS.BY_FUEL_STATION(stationId)
    )
    return response.data.data!
  },
}