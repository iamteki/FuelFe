import axios from 'axios'
import { toast } from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('An error occurred. Please try again.')
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
}

// Vehicle API
export const vehicleAPI = {
  register: (vehicleData) => api.post('/vehicles/register', vehicleData),
  getMyVehicles: () => api.get('/vehicles/my-vehicles'),
  getVehicleById: (id) => api.get(`/vehicles/${id}`),
  getAllVehicles: () => api.get('/vehicles'),
  searchVehicles: (keyword) => api.get(`/vehicles/search?keyword=${keyword}`),
  getVehicleQuota: (id) => api.get(`/vehicles/${id}/quota`),
}

// Station API
export const stationAPI = {
  getAllStations: () => api.get('/stations'),
  getStationById: (id) => api.get(`/stations/${id}`),
  createStation: (stationData) => api.post('/stations', stationData),
  updateStation: (id, stationData) => api.put(`/stations/${id}`, stationData),
  deleteStation: (id) => api.delete(`/stations/${id}`),
}

// Transaction API
export const transactionAPI = {
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  getTransactionHistory: (vehicleId) => api.get(`/transactions/vehicle/${vehicleId}`),
  getStationTransactions: (stationId) => api.get(`/transactions/station/${stationId}`),
  updateTransactionStatus: (id, status) => api.patch(`/transactions/${id}/status`, { status }),
}

export default api
