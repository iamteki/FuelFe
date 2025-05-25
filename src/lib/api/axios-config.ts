import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data, config } = error.response
      
      if (status === 401) {
        // Check if this is a login attempt
        if (config.url?.includes('/auth/login')) {
          // Don't redirect on login failure, just show error
          toast.error(data?.message || 'Invalid credentials')
        } else {
          // Only redirect for other 401 errors (actual session expiry)
          const token = localStorage.getItem('token')
          if (token) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
            toast.error('Session expired. Please login again.')
          }
        }
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action')
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.')
      } else if (data?.message) {
        toast.error(data.message)
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.')
    } else {
      // Something else happened
      toast.error('An unexpected error occurred')
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance