// src/app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api/admin-api'
import { DashboardStatsResponse } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getDashboardStats()
      setStats(data)
    } catch (error) {
      toast.error('Failed to load dashboard statistics')
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and statistics</p>
      </div>

      {/* Quick Actions */}
      {stats && stats.pendingFuelStations > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-yellow-600 mr-3 text-xl"></i>
              <div>
                <p className="font-medium text-yellow-800">Pending Approvals</p>
                <p className="text-sm text-yellow-700">
                  {stats.pendingFuelStations} fuel station(s) waiting for approval
                </p>
              </div>
            </div>
            <Link
              href="/admin/fuel-stations"
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Review Now
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
        </div>

        {/* Total Vehicles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-car text-green-600 text-xl"></i>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Vehicles</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalVehicles || 0}</p>
        </div>

        {/* Total Fuel Stations */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-gas-pump text-purple-600 text-xl"></i>
            </div>
            {stats && stats.pendingFuelStations > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                {stats.pendingFuelStations} pending
              </span>
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-500">Fuel Stations</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalFuelStations || 0}</p>
        </div>

        {/* Active Operators */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="fas fa-user-tie text-orange-600 text-xl"></i>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Active Operators</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.activeOperators || 0}</p>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Today's Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Activity</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Transactions</span>
              <span className="text-xl font-semibold">{stats?.todayTransactions || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Fuel Pumped</span>
              <span className="text-xl font-semibold">
                {stats?.todayFuelPumped?.toFixed(2) || '0.00'} L
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue</span>
              <span className="text-xl font-semibold text-green-600">
                Rs. {((stats?.todayFuelPumped || 0) * 450).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Transactions</span>
              <span className="text-xl font-semibold">{stats?.totalTransactions || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Fuel Pumped</span>
              <span className="text-xl font-semibold">
                {stats?.totalFuelPumped?.toFixed(2) || '0.00'} L
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-xl font-semibold text-green-600">
                Rs. {stats?.totalRevenue?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/admin/fuel-stations"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <i className="fas fa-gas-pump text-3xl text-purple-600"></i>
            <i className="fas fa-arrow-right text-gray-400 group-hover:text-gray-600 transition-colors"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Manage Fuel Stations</h3>
          <p className="text-gray-600 text-sm mt-2">Approve pending stations and manage existing ones</p>
        </Link>

        <Link 
          href="/admin/users"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <i className="fas fa-users text-3xl text-blue-600"></i>
            <i className="fas fa-arrow-right text-gray-400 group-hover:text-gray-600 transition-colors"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
          <p className="text-gray-600 text-sm mt-2">View and manage all system users</p>
        </Link>

        <Link 
          href="/admin/reports"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <i className="fas fa-chart-bar text-3xl text-green-600"></i>
            <i className="fas fa-arrow-right text-gray-400 group-hover:text-gray-600 transition-colors"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Generate Reports</h3>
          <p className="text-gray-600 text-sm mt-2">View detailed analytics and reports</p>
        </Link>
      </div>
    </div>
  )
}