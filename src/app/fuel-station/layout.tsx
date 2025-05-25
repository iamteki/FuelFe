// src/app/fuel-station/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { RootState } from '@/store'
import { logout } from '@/store/slices/authSlice'

export default function FuelStationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, isInitialized } = useSelector((state: RootState) => state.auth)
  
  useEffect(() => {
    if (isInitialized && (!isAuthenticated || user?.role !== 'FUEL_STATION_OWNER')) {
      router.push('/login')
    }
  }, [isAuthenticated, user, router, isInitialized])
  
  const handleLogout = () => {
    dispatch(logout())
    router.replace('/login')
  }
  
  if (!isInitialized || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }
  
  if (!isAuthenticated || user?.role !== 'FUEL_STATION_OWNER') {
    return null
  }
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 flex-1">
          <div className="flex items-center mb-8">
            <i className="fas fa-gas-pump text-2xl mr-2"></i>
            <span className="text-xl font-bold">Fuel Station</span>
          </div>
          
          <nav className="space-y-2">
            <Link
              href="/fuel-station/dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-tachometer-alt mr-2"></i>
              Dashboard
            </Link>
            <Link
              href="/fuel-station/register"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-store mr-2"></i>
              Station Details
            </Link>
            <Link
              href="/fuel-station/operators"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-users mr-2"></i>
              Operators
            </Link>
            <Link
              href="/fuel-station/operators/add"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Add Operator
            </Link>
            <Link
              href="/fuel-station/transactions"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-receipt mr-2"></i>
              Transactions
            </Link>
            <Link
              href="/fuel-station/profile"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-user mr-2"></i>
              Profile
            </Link>
          </nav>
        </div>
        
        <div className="p-4">
          <div className="mb-4 p-3 bg-gray-700 rounded">
            <p className="text-sm text-gray-300">Logged in as:</p>
            <p className="font-medium">{user?.username}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {children}
      </div>
    </div>
  )
}