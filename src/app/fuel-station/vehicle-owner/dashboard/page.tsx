'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { RootState } from '@/store'
import { vehicleOwnerAPI } from '@/lib/api/vehicle-owner-api'
import { VehicleOwnerStats } from '@/types'
import toast from 'react-hot-toast'
import { logout } from '@/store/slices/authSlice'

export default function VehicleOwnerDashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [stats, setStats] = useState<VehicleOwnerStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Check authentication
    if (!user) {
      router.push('/login')
      return
    }
    fetchDashboardStats()
  }, [user, router])
  
  const fetchDashboardStats = async () => {
    try {
      const data = await vehicleOwnerAPI.getDashboardStats()
      console.log('Dashboard stats received:', data) // Debug log
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Owner Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={() => {
                  dispatch(logout())
                  router.push('/login')
                }}
                className="text-red-600 hover:text-red-800"
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Vehicles */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-car text-3xl text-blue-500"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Vehicles</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.totalVehicles || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          {/* Verified Vehicles */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-check-circle text-3xl text-green-500"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Verified Vehicles</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.verifiedVehicles || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          {/* Monthly Fuel Consumed */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-gas-pump text-3xl text-yellow-500"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Fuel</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.monthlyFuelConsumed || 0}L</dd>
                </dl>
              </div>
            </div>
          </div>
          
          {/* Monthly Transactions */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-receipt text-3xl text-purple-500"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Transactions</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.monthlyTransactions || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/vehicle-owner/vehicles/register"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Register New Vehicle
            </Link>
            <Link
              href="/vehicle-owner/vehicles"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <i className="fas fa-list mr-2"></i>
              View My Vehicles
            </Link>
            <Link
              href="/vehicle-owner/transactions"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 transition-colors"
            >
              <i className="fas fa-receipt mr-2"></i>
              Transaction History
            </Link>
          </div>
        </div>
        
        {/* Monthly Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fuel Consumption */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Fuel Consumed This Month</span>
                <i className="fas fa-gas-pump text-yellow-500"></i>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.monthlyFuelConsumed || 0}L</p>
              <p className="text-xs text-gray-500 mt-1">Total liters pumped</p>
            </div>
            
            {/* Transactions */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Transactions This Month</span>
                <i className="fas fa-receipt text-purple-500"></i>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.monthlyTransactions || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Total fuel pumping sessions</p>
            </div>
          </div>
          
          {/* Vehicle Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">Vehicle Registration Status</span>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {stats?.verifiedVehicles || 0} of {stats?.totalVehicles || 0} vehicles verified
                </p>
              </div>
              {stats && stats.totalVehicles > 0 && stats.verifiedVehicles < stats.totalVehicles && (
                <Link
                  href="/vehicle-owner/vehicles"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View unverified vehicles →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}