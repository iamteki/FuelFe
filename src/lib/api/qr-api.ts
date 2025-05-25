import axiosInstance from './axios-config'
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints'
import { QRCodeResponse, VehicleResponse, ApiResponse } from '@/types'

export const qrAPI = {
  generateQRCode: async (vehicleId: number): Promise<QRCodeResponse> => {
    const response = await axiosInstance.get<ApiResponse<QRCodeResponse>>(
      API_ENDPOINTS.QR.GENERATE(vehicleId)
    )
    return response.data.data!
  },

  scanQRCode: async (qrCode: string): Promise<VehicleResponse> => {
    const response = await axiosInstance.post<ApiResponse<VehicleResponse>>(
      API_ENDPOINTS.QR.SCAN,
      null,
      { params: { qrCode } }
    )
    return response.data.data!
  },
}