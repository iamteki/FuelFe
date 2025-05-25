import axiosInstance from './axios-config'
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints'
import { 
  Vehicle, 
  VehicleRegistrationRequest, 
  VehicleResponse, 
  ApiResponse 
} from '@/types'

export const vehicleAPI = {
  register: async (data: VehicleRegistrationRequest): Promise<Vehicle> => {
    const response = await axiosInstance.post<ApiResponse<Vehicle>>(
      API_ENDPOINTS.VEHICLE_OWNER.VEHICLES.REGISTER,
      data
    )
    return response.data.data!
  },

  getMyVehicles: async (): Promise<VehicleResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<VehicleResponse[]>>(
      API_ENDPOINTS.VEHICLE_OWNER.VEHICLES.LIST
    )
    return response.data.data!
  },

  getVehicleById: async (id: number): Promise<VehicleResponse> => {
    const response = await axiosInstance.get<ApiResponse<VehicleResponse>>(
      API_ENDPOINTS.VEHICLE_OWNER.VEHICLES.BY_ID(id)
    )
    return response.data.data!
  },

  getVehicleByNumber: async (number: string): Promise<VehicleResponse> => {
    const response = await axiosInstance.get<ApiResponse<VehicleResponse>>(
      API_ENDPOINTS.VEHICLE_OWNER.VEHICLES.BY_NUMBER(number)
    )
    return response.data.data!
  },

  updateVehicle: async (id: number, data: VehicleRegistrationRequest): Promise<Vehicle> => {
    const response = await axiosInstance.put<ApiResponse<Vehicle>>(
      API_ENDPOINTS.VEHICLE_OWNER.VEHICLES.UPDATE(id),
      data
    )
    return response.data.data!
  },

  deleteVehicle: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.VEHICLE_OWNER.VEHICLES.DELETE(id))
  },
}