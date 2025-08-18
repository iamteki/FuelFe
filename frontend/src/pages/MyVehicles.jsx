import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { vehicleAPI } from '../services/api'
import { Car, Plus, Fuel, QrCode, Calendar } from 'lucide-react'

const MyVehicles = () => {
  const { data: vehicles, isLoading, error } = useQuery(
    'myVehicles',
    () => vehicleAPI.getMyVehicles().then(res => res.data)
  )

  const getFuelTypeColor = (fuelType) => {
    return fuelType === 'PETROL' ? 'text-fuel-petrol' : 'text-fuel-diesel'
  }

  const getVehicleTypeDisplay = (type) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load vehicles. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-600">Manage your registered vehicles</p>
        </div>
        <Link
          to="/register-vehicle"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register Vehicle</span>
        </Link>
      </div>

      {/* Vehicles Grid */}
      {!vehicles || vehicles.length === 0 ? (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles registered</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by registering your first vehicle.</p>
          <div className="mt-6">
            <Link
              to="/register-vehicle"
              className="btn btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Register Vehicle</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Car className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {vehicle.registrationNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                </div>
                {vehicle.qrCodePath && (
                  <QrCode className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{getVehicleTypeDisplay(vehicle.vehicleType)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className={`font-medium ${getFuelTypeColor(vehicle.fuelType)}`}>
                    {vehicle.fuelType}
                  </span>
                </div>

                {vehicle.engineCapacity && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Engine:</span>
                    <span className="font-medium">{vehicle.engineCapacity}cc</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Weekly Quota:</span>
                  <span className="font-medium flex items-center space-x-1">
                    <Fuel className="w-3 h-3" />
                    <span>{vehicle.weeklyQuota}L</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-green-600 flex items-center space-x-1">
                    <Fuel className="w-3 h-3" />
                    <span>{vehicle.currentQuota}L</span>
                  </span>
                </div>

                {vehicle.registrationDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Registered:</span>
                    <span className="font-medium flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(vehicle.registrationDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                )}

                {/* Quota Progress Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Quota Used</span>
                    <span>
                      {Math.round(((vehicle.weeklyQuota - vehicle.currentQuota) / vehicle.weeklyQuota) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${((vehicle.weeklyQuota - vehicle.currentQuota) / vehicle.weeklyQuota) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/vehicles/${vehicle.id}`}
                  className="w-full btn btn-secondary text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyVehicles
