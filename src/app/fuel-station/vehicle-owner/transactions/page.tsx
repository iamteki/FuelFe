'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { vehicleAPI } from '@/lib/api/vehicle-api'
import { transactionAPI } from '@/lib/api/transaction-api'
import { VehicleResponse, TransactionResponse } from '@/types'

export default function TransactionsPage() {
  const searchParams = useSearchParams()
  const vehicleId = searchParams.get('vehicleId')
  
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    vehicleId ? parseInt(vehicleId) : null
  )
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  
  useEffect(() => {
    fetchVehicles()
  }, [])
  
  useEffect(() => {
    if (selectedVehicleId) {
      fetchTransactions(selectedVehicleId)
    }
  }, [selectedVehicleId])
  
  const fetchVehicles = async () => {
    try {
      const data = await vehicleAPI.getMyVehicles()
      setVehicles(data)
      
      // Auto-select first vehicle if no vehicle selected
      if (!selectedVehicleId && data.length > 0) {
        setSelectedVehicleId(data[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchTransactions = async (vehicleId: number) => {
    try {
      setLoadingTransactions(true)
      const data = await transactionAPI.getTransactionsByVehicle(vehicleId)
      setTransactions(data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setLoadingTransactions(false)
    }
  }
  
  const getTotalFuel = () => {
    return transactions.reduce((sum, t) => sum + parseFloat(t.pumpedLiters.toString()), 0).toFixed(2)
  }
  
  const getTotalAmount = () => {
    return transactions.reduce((sum, t) => sum + parseFloat(t.totalAmount.toString()), 0).toFixed(2)
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
            <div className="flex items-center">
              <Link href="/vehicle-owner/dashboard" className="mr-4">
                <i className="fas fa-arrow-left text-gray-600 hover:text-gray-900"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vehicle Selector */}
        {vehicles.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-2">
                Select Vehicle
              </label>
              <select
                id="vehicle"
                value={selectedVehicleId || ''}
                onChange={(e) => setSelectedVehicleId(parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNumber} - {vehicle.vehicleType} ({vehicle.fuelType})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Transactions Summary */}
            {selectedVehicleId && transactions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <i className="fas fa-receipt text-blue-500 text-2xl mr-3"></i>
                    <div>
                      <p className="text-sm text-gray-600">Total Transactions</p>
                      <p className="text-xl font-semibold">{transactions.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <i className="fas fa-gas-pump text-green-500 text-2xl mr-3"></i>
                    <div>
                      <p className="text-sm text-gray-600">Total Fuel Pumped</p>
                      <p className="text-xl font-semibold">{getTotalFuel()}L</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <i className="fas fa-dollar-sign text-purple-500 text-2xl mr-3"></i>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-semibold">Rs. {getTotalAmount()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loadingTransactions ? (
                <div className="p-6 text-center">
                  <div className="spinner mx-auto"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-6 text-center">
                  <i className="fas fa-receipt text-4xl text-gray-300 mb-3"></i>
                  <p className="text-gray-500">No transactions found for this vehicle</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fuel Station
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fuel Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(transaction.transactionDate), 'dd MMM yyyy, hh:mm a')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.fuelStationName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.fuelType === 'PETROL' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.fuelType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.pumpedLiters}L
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Rs. {transaction.unitPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Rs. {transaction.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {transaction.smsSent ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <i className="fas fa-check-circle mr-1"></i>
                                SMS Sent
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <i className="fas fa-clock mr-1"></i>
                                SMS Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <i className="fas fa-car text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles registered</h3>
            <p className="text-gray-600 mb-6">Register a vehicle to view transaction history</p>
            <Link
              href="/vehicle-owner/vehicles/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Register Vehicle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}