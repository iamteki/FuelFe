'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { RootState } from '@/store'
import { logout } from '@/store/slices/authSlice'

export default function VehicleOwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, isInitialized } = useSelector((state: RootState) => state.auth)
  
  useEffect(() => {
    // Only redirect after initialization is complete
    if (isInitialized && (!isAuthenticated || user?.role !== 'VEHICLE_OWNER')) {
      router.push('/login')
    }
  }, [isAuthenticated, user, router, isInitialized])
  
  const handleLogout = () => {
    dispatch(logout())
    router.replace('/login')  // Use replace instead of push to prevent back navigation
  }
  
  // Show loading while checking auth
  if (!isInitialized || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }
  
  // Don't render anything if not authenticated
  if (!isAuthenticated || user?.role !== 'VEHICLE_OWNER') {
    return null
  }
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 flex-1">
          <div className="flex items-center mb-8">
            <i className="fas fa-gas-pump text-2xl mr-2"></i>
            <span className="text-xl font-bold">Fuel Quota</span>
          </div>
          
          <nav className="space-y-2">
            <Link
              href="/vehicle-owner/dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-tachometer-alt mr-2"></i>
              Dashboard
            </Link>
            <Link
              href="/vehicle-owner/vehicles"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-car mr-2"></i>
              My Vehicles
            </Link>
            <Link
              href="/vehicle-owner/vehicles/register"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Register Vehicle
            </Link>
            <Link
              href="/vehicle-owner/transactions"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-receipt mr-2"></i>
              Transactions
            </Link>
            <Link
              href="/vehicle-owner/qr-codes"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-qrcode mr-2"></i>
              QR Codes
            </Link>
            <Link
              href="/vehicle-owner/profile"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-user mr-2"></i>
              Profile
            </Link>
          </nav>
        </div>
        
        <div className="p-4">
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
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}