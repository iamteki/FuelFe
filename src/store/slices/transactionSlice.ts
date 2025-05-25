import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TransactionResponse } from '@/types'

interface TransactionState {
  transactions: TransactionResponse[]
  loading: boolean
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<TransactionResponse[]>) => {
      state.transactions = action.payload
    },
    addTransaction: (state, action: PayloadAction<TransactionResponse>) => {
      state.transactions.unshift(action.payload) // Add to beginning
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setTransactions, addTransaction, setLoading } = transactionSlice.actions

export default transactionSlice.reducer