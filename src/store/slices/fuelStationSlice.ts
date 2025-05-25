import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FuelStationResponse, FuelStationOperator } from '@/types'

interface FuelStationState {
  myStation: FuelStationResponse | null
  operators: FuelStationOperator[]
  loading: boolean
}

const initialState: FuelStationState = {
  myStation: null,
  operators: [],
  loading: false,
}

const fuelStationSlice = createSlice({
  name: 'fuelStation',
  initialState,
  reducers: {
    setMyStation: (state, action: PayloadAction<FuelStationResponse>) => {
      state.myStation = action.payload
    },
    setOperators: (state, action: PayloadAction<FuelStationOperator[]>) => {
      state.operators = action.payload
    },
    addOperator: (state, action: PayloadAction<FuelStationOperator>) => {
      state.operators.push(action.payload)
    },
    updateOperator: (state, action: PayloadAction<FuelStationOperator>) => {
      const index = state.operators.findIndex(o => o.id === action.payload.id)
      if (index !== -1) {
        state.operators[index] = action.payload
      }
    },
    removeOperator: (state, action: PayloadAction<number>) => {
      state.operators = state.operators.filter(o => o.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  setMyStation,
  setOperators,
  addOperator,
  updateOperator,
  removeOperator,
  setLoading,
} = fuelStationSlice.actions

export default fuelStationSlice.reducer