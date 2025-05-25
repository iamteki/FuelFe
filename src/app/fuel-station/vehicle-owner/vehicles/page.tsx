'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { vehicleAPI } from '@/lib/api/vehicle-api'
import { VehicleResponse } from '@/types'

export default function VehiclesListPage() {
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchVehicles()
  }, [])
  
  const fetchVehicles = async () => {
    try {
      const data = await vehicleAPI.getMyVehicles()
      setVehicles(data)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (vehicleId: number, vehicleNumber: string) => {
    if (!confirm(`Are you sure you want to delete vehicle ${vehicleNumber}?`)) {
      return
    }
    
    try {
      await vehicleAPI.deleteVehicle(vehicleId)
      toast.success('Vehicle deleted successfully')
      fetchVehicles() // Refresh the list
    } catch (error) {
      toast.error('Failed to delete vehicle')
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
            <div className="flex items-center">
              <Link href="/vehicle-owner/dashboard" className="mr-4">
                <i className="fas fa-arrow-left text-gray-600 hover:text-gray-900"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
            </div>
            <Link
              href="/vehicle-owner/vehicles/register"
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Register New Vehicle
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <i className="fas fa-car text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles registered</h3>
            <p className="text-gray-600 mb-6">Get started by registering your first vehicle</p>
            <Link
              href="/vehicle-owner/vehicles/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Register Vehicle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vehicle.vehicleNumber}</h3>
                      <p className="text-sm text-gray-600">{vehicle.vehicleType}</p>
                    </div>
                    {vehicle.isVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i className="fas fa-check-circle mr-1"></i>
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fuel Type:</span>
                      <span className="font-medium">{vehicle.fuelType}</span>
                    </div>
                    {vehicle.make && vehicle.model && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                      </div>
                    )}
                    {vehicle.currentQuota && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining Quota:</span>
                        <span className="font-medium text-green-600">{vehicle.currentQuota.remainingQuota}L</span>
                      </div>
                    )}
                  </div>
                  
                  {vehicle.currentQuota && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${100 - ((vehicle.currentQuota.remainingQuota / vehicle.currentQuota.allocatedQuota) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/vehicle-owner/vehicles/${vehicle.id}`}
                      className="flex-1 text-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <i className="fas fa-qrcode mr-1"></i>
                      View QR
                    </Link>
                    <Link
                      href={`/vehicle-owner/transactions?vehicleId=${vehicle.id}`}
                      className="flex-1 text-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <i className="fas fa-history mr-1"></i>
                      History
                    </Link>
                    <button
                      onClick={() => handleDelete(vehicle.id, vehicle.vehicleNumber)}
                      className="px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}