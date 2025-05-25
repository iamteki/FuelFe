'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadUserFromStorage } from '@/store/slices/authSlice'
import { RootState } from '@/store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { isInitialized } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Load user from storage only once when app starts
    if (!isInitialized) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, isInitialized])

  return <>{children}</>
}