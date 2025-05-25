// src/app/fuel-station/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setMyStation } from '@/store/slices/fuelStationSlice'
import { fuelStationAPI } from '@/lib/api/fuel-station-api'
import { transactionAPI } from '@/lib/api/transaction-api'
import toast from 'react-hot-toast'

interface StationStats {
  totalOperators: number
  activeOperators: number
  todayTransactions: number
  monthlyTransactions: number
  todayFuelDispensed: number
  monthlyFuelDispensed: number
  todayRevenue: number
  monthlyRevenue: number
  stationStatus: string
  approvalStatus: string
}

export default function FuelStationDashboard() {
  const dispatch = useDispatch()
  const { myStation } = useSelector((state: RootState) => state.fuelStation)
  const [stats, setStats] = useState<StationStats | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch station details if not in store
      if (!myStation) {
        const station = await fuelStationAPI.getMyStation()
        dispatch(setMyStation(station))
      }
      
      // Fetch stats
      const statsData = await fuelStationAPI.getStationStats()
      setStats(statsData)
      
      // Fetch recent transactions if station is approved
      if (myStation?.id || statsData.approvalStatus === 'Approved') {
        try {
          const transactions = await transactionAPI.getTransactionsByFuelStation(myStation?.id || 0)
          setRecentTransactions(transactions.slice(0, 5)) // Get latest 5
        } catch (error) {
          console.log('No transactions yet')
        }
      }
    } catch (error) {
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Fuel Station Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's your station overview.
        </p>
      </div>

      {/* Station Status Alert */}
      {myStation && !myStation.isApproved && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-yellow-600 mr-3"></i>
            <div>
              <p className="font-medium text-yellow-800">Pending Approval</p>
              <p className="text-sm text-yellow-700">
                Your fuel station registration is pending admin approval. Some features may be limited.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-users text-blue-600"></i>
            </div>
            <span className={`text-sm px-2 py-1 rounded ${
              stats?.stationStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {stats?.stationStatus}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Operators</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalOperators || 0}</p>
          <p className="text-sm text-gray-500 mt-1">{stats?.activeOperators || 0} active</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-gas-pump text-green-600"></i>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Today's Fuel Dispensed</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.todayFuelDispensed.toFixed(2) || 0} L</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats?.monthlyFuelDispensed.toFixed(2) || 0} L this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-chart-line text-purple-600"></i>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Today's Transactions</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.todayTransactions || 0}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats?.monthlyTransactions || 0} this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-dollar-sign text-yellow-600"></i>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Today's Revenue</h3>
          <p className="text-2xl font-bold text-gray-800">
            Rs. {stats?.todayRevenue.toFixed(2) || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Rs. {stats?.monthlyRevenue.toFixed(2) || 0} this month
          </p>
        </div>
      </div>

      {/* Station Info & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Station Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Station Information</h2>
          {myStation ? (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Station Name</span>
                <span className="font-medium">{myStation.stationName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Registration No</span>
                <span className="font-medium">{myStation.registrationNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">District</span>
                <span className="font-medium">{myStation.district || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Contact</span>
                <span className="font-medium">{myStation.contactNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Approval Status</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  myStation.isApproved 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {myStation.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No station registered yet</p>
              <a 
                href="/fuel-station/register" 
                className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
              >
                Register your station →
              </a>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
            <a 
              href="/fuel-station/transactions" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all →
            </a>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-800">{transaction.vehicleNumber}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.transactionDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.pumpedLiters} L</p>
                    <p className="text-sm text-green-600">Rs. {transaction.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-receipt text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}