import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { clearAuthData } from '@/lib/utils/auth'

export interface User {
  id: number
  username: string
  email: string
  role: 'VEHICLE_OWNER' | 'FUEL_STATION_OWNER' | 'ADMIN' | 'FUEL_STATION_OPERATOR'
  phoneNumber?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  isInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
      state.isInitialized = true
      // Save to localStorage
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.isInitialized = true
      // Clear all auth data
      clearAuthData()
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          state.user = user
          state.token = token
          state.isAuthenticated = true
        } catch (error) {
          console.error('Failed to parse user from storage:', error)
          clearAuthData()
        }
      }
      state.loading = false
      state.isInitialized = true
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { loginSuccess, logout, loadUserFromStorage, setLoading } = authSlice.actions
export default authSlice.reducer