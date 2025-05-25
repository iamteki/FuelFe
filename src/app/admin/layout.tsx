// src/app/admin/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { RootState } from '@/store'
import { logout } from '@/store/slices/authSlice'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, isInitialized } = useSelector((state: RootState) => state.auth)
  
  useEffect(() => {
    if (isInitialized && (!isAuthenticated || user?.role !== 'ADMIN')) {
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
  
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 flex-1">
          <div className="flex items-center mb-8">
            <i className="fas fa-shield-alt text-2xl mr-2 text-yellow-400"></i>
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          
          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-tachometer-alt mr-2"></i>
              Dashboard
            </Link>
            <Link
              href="/admin/fuel-stations"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-gas-pump mr-2"></i>
              Fuel Stations
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-users mr-2"></i>
              Users
            </Link>
            <Link
              href="/admin/vehicles"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-car mr-2"></i>
              Vehicles
            </Link>
            <Link
              href="/admin/transactions"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-receipt mr-2"></i>
              Transactions
            </Link>
            <Link
              href="/admin/reports"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-chart-bar mr-2"></i>
              Reports
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-cog mr-2"></i>
              Settings
            </Link>
          </nav>
        </div>
        
        <div className="p-4">
          <div className="mb-4 p-3 bg-gray-800 rounded">
            <p className="text-sm text-gray-400">Logged in as:</p>
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
      <div className="flex-1 bg-gray-100">
        {children}
      </div>
    </div>
  )
}