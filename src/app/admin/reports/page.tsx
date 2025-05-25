// src/app/admin/reports/page.tsx
'use client'

import { useState } from 'react'
import { adminAPI } from '@/lib/api/admin-api'
import toast from 'react-hot-toast'

type ReportType = 'transactions' | 'fuel-consumption' | null

export default function AdminReports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null)
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  // Transaction Report filters
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Fuel Consumption filter
  const [period, setPeriod] = useState('month')

  const generateTransactionReport = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getTransactionReport(startDate, endDate)
      setReportData(data)
    } catch (error) {
      toast.error('Failed to generate transaction report')
    } finally {
      setLoading(false)
    }
  }

  const generateFuelConsumptionReport = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getFuelConsumptionReport(period)
      setReportData(data)
    } catch (error) {
      toast.error('Failed to generate fuel consumption report')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
        <p className="text-gray-600">Generate and view system reports</p>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div 
          onClick={() => setSelectedReport('transactions')}
          className={`bg-white p-6 rounded-lg shadow cursor-pointer transition-all ${
            selectedReport === 'transactions' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-receipt text-blue-600 text-xl"></i>
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">Transaction Report</h3>
          </div>
          <p className="text-gray-600 text-sm">
            View transactions for a specific date range, including revenue and fuel dispensed
          </p>
        </div>

        <div 
          onClick={() => setSelectedReport('fuel-consumption')}
          className={`bg-white p-6 rounded-lg shadow cursor-pointer transition-all ${
            selectedReport === 'fuel-consumption' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-gas-pump text-green-600 text-xl"></i>
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">Fuel Consumption Report</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Analyze fuel consumption patterns by vehicle type and time period
          </p>
        </div>
      </div>

      {/* Report Filters */}
      {selectedReport && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Parameters</h2>
          
          {selectedReport === 'transactions' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={generateTransactionReport}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
          )}

          {selectedReport === 'fuel-consumption' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={generateFuelConsumptionReport}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report Results */}
      {reportData && (
        <div className="bg-white rounded-lg shadow p-6">
          {selectedReport === 'transactions' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction Report</h2>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {reportData.totalTransactions || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Total Fuel Pumped</p>
                  <p className="text-2xl font-bold text-green-800">
                    {reportData.totalLitersPumped?.toFixed(2) || '0.00'} L
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {formatCurrency(reportData.totalRevenue || 0)}
                  </p>
                </div>
              </div>

              {/* Fuel Type Breakdown */}
              {reportData.fuelTypeBreakdown && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Fuel Type Breakdown</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(reportData.fuelTypeBreakdown).map(([type, liters]: [string, any]) => (
                      <div key={type} className="bg-gray-50 p-4 rounded">
                        <p className="text-sm text-gray-600">{type}</p>
                        <p className="text-xl font-semibold">{liters.toFixed(2)} L</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Breakdown */}
              {reportData.dailyBreakdown && Object.keys(reportData.dailyBreakdown).length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Daily Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Transactions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(reportData.dailyBreakdown).map(([date, count]: [string, any]) => (
                          <tr key={date}>
                            <td className="px-4 py-2 text-sm">{formatDate(date)}</td>
                            <td className="px-4 py-2 text-sm">{count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedReport === 'fuel-consumption' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Fuel Consumption Report</h2>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Total Consumption</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {reportData.totalConsumption?.toFixed(2) || '0.00'} L
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Avg Daily Consumption</p>
                  <p className="text-2xl font-bold text-green-800">
                    {reportData.averageDailyConsumption?.toFixed(2) || '0.00'} L
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {reportData.totalTransactions || 0}
                  </p>
                </div>
              </div>

              {/* Vehicle Type Consumption */}
              {reportData.vehicleTypeConsumption && (
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Consumption by Vehicle Type</h3>
                  <div className="space-y-3">
                    {Object.entries(reportData.vehicleTypeConsumption).map(([type, liters]: [string, any]) => (
                      <div key={type} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span className="font-medium">{type}</span>
                        <span className="text-lg">{liters.toFixed(2)} L</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}