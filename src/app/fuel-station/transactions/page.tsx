// src/app/fuel-station/transactions/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { transactionAPI } from '@/lib/api/transaction-api'
import { fuelStationAPI } from '@/lib/api/fuel-station-api'
import { TransactionResponse } from '@/types'
import toast from 'react-hot-toast'

export default function FuelStationTransactionsPage() {
  const { myStation } = useSelector((state: RootState) => state.fuelStation)
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [fuelTypeFilter, setFuelTypeFilter] = useState('all')

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [transactions, dateFilter, searchTerm, fuelTypeFilter])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      
      // Get station if not already loaded
      let stationId = myStation?.id
      if (!stationId) {
        const station = await fuelStationAPI.getMyStation()
        stationId = station.id
      }
      
      if (stationId) {
        const data = await transactionAPI.getTransactionsByFuelStation(stationId)
        setTransactions(data)
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load transactions')
      }
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...transactions]
    
    // Date filter
    const now = new Date()
    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(t => 
          new Date(t.transactionDate).toDateString() === now.toDateString()
        )
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(t => new Date(t.transactionDate) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(t => new Date(t.transactionDate) >= monthAgo)
        break
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.operatorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Fuel type filter
    if (fuelTypeFilter !== 'all') {
      filtered = filtered.filter(t => t.fuelType === fuelTypeFilter)
    }
    
    setFilteredTransactions(filtered)
  }

  const calculateStats = () => {
    const stats = {
      totalTransactions: filteredTransactions.length,
      totalLiters: filteredTransactions.reduce((sum, t) => sum + Number(t.pumpedLiters), 0),
      totalRevenue: filteredTransactions.reduce((sum, t) => sum + Number(t.totalAmount), 0),
      avgTransaction: 0,
    }
    stats.avgTransaction = stats.totalTransactions > 0 
      ? stats.totalRevenue / stats.totalTransactions 
      : 0
    return stats
  }

  const stats = calculateStats()

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Transactions</h1>
        <p className="text-gray-600">View all fuel transactions at your station</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-exchange-alt text-blue-600 text-xl"></i>
          </div>
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalTransactions}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-gas-pump text-green-600 text-xl"></i>
          </div>
          <p className="text-sm text-gray-500">Total Fuel Dispensed</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalLiters.toFixed(2)} L</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-dollar-sign text-yellow-600 text-xl"></i>
          </div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">Rs. {stats.totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-chart-line text-purple-600 text-xl"></i>
          </div>
          <p className="text-sm text-gray-500">Avg Transaction</p>
          <p className="text-2xl font-bold text-gray-800">Rs. {stats.avgTransaction.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Vehicle number or operator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
            <select
              value={fuelTypeFilter}
              onChange={(e) => setFuelTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setDateFilter('all')
                setSearchTerm('')
                setFuelTypeFilter('all')
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liters
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SMS Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.transactionDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.vehicleNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.operatorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.fuelType === 'PETROL'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.fuelType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.pumpedLiters}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs. {transaction.unitPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rs. {transaction.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.smsSent ? (
                        <span className="text-green-600">
                          <i className="fas fa-check-circle"></i> Sent
                        </span>
                      ) : (
                        <span className="text-yellow-600">
                          <i className="fas fa-clock"></i> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12">
          <div className="text-center">
            <i className="fas fa-receipt text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-500">
              {transactions.length === 0 
                ? "No transactions have been recorded yet." 
                : "No transactions match your filters."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}