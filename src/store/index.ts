import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import vehicleReducer from './slices/vehicleSlice'
import fuelStationReducer from './slices/fuelStationSlice'
import transactionReducer from './slices/transactionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicle: vehicleReducer,
    fuelStation: fuelStationReducer,
    transaction: transactionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch