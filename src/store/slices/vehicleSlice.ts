import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VehicleResponse } from '@/types'

interface VehicleState {
  vehicles: VehicleResponse[]
  currentVehicle: VehicleResponse | null
  loading: boolean
}

const initialState: VehicleState = {
  vehicles: [],
  currentVehicle: null,
  loading: false,
}

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<VehicleResponse[]>) => {
      state.vehicles = action.payload
    },
    setCurrentVehicle: (state, action: PayloadAction<VehicleResponse>) => {
      state.currentVehicle = action.payload
    },
    addVehicle: (state, action: PayloadAction<VehicleResponse>) => {
      state.vehicles.push(action.payload)
    },
    updateVehicle: (state, action: PayloadAction<VehicleResponse>) => {
      const index = state.vehicles.findIndex(v => v.id === action.payload.id)
      if (index !== -1) {
        state.vehicles[index] = action.payload
      }
    },
    removeVehicle: (state, action: PayloadAction<number>) => {
      state.vehicles = state.vehicles.filter(v => v.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  setVehicles,
  setCurrentVehicle,
  addVehicle,
  updateVehicle,
  removeVehicle,
  setLoading,
} = vehicleSlice.actions

export default vehicleSlice.reducer