import axiosInstance from './axios-config'
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints'
import { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  ApiResponse 
} from '@/types'

export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    )
    return response.data.data!
  },

  register: async (data: RegisterRequest): Promise<any> => {
    const response = await axiosInstance.post<ApiResponse<any>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    )
    return response.data.data
  },

  checkUsernameAvailability: async (username: string): Promise<boolean> => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(
      `${API_ENDPOINTS.AUTH.CHECK_USERNAME}?username=${username}`
    )
    return response.data.data!
  },

  checkEmailAvailability: async (email: string): Promise<boolean> => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(
      `${API_ENDPOINTS.AUTH.CHECK_EMAIL}?email=${email}`
    )
    return response.data.data!
  },
}