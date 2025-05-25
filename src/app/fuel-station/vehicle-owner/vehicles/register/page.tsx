'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { vehicleAPI } from '@/lib/api/vehicle-api'
import { VehicleRegistrationRequest } from '@/types'

const vehicleTypes = [
  { value: 'CAR', label: 'Car' },
  { value: 'VAN', label: 'Van' },
  { value: 'BUS', label: 'Bus' },
  { value: 'MOTORCYCLE', label: 'Motorcycle' },
  { value: 'THREE_WHEELER', label: 'Three Wheeler' },
  { value: 'TRUCK', label: 'Truck' },
]

const fuelTypes = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
]

export default function VehicleRegistrationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleRegistrationRequest>()

  const onSubmit = async (data: VehicleRegistrationRequest) => {
    try {
      setIsLoading(true)
      setVerifying(true)
      
      // Show verification message
      toast.loading('Verifying vehicle with Department of Motor Traffic...', {
        id: 'verification',
      })
      
      const vehicle = await vehicleAPI.register(data)
      
      toast.dismiss('verification')
      toast.success('Vehicle registered successfully!')
      
      // Redirect to QR code page
      router.push(`/vehicle-owner/vehicles/${vehicle.id}`)
    } catch (error: any) {
      toast.dismiss('verification')
      if (error.response?.data?.message?.includes('verification')) {
        toast.error('Vehicle verification failed. Please check your details.')
      }
    } finally {
      setIsLoading(false)
      setVerifying(false)
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Register New Vehicle</h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* Registration Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Vehicle Information</h2>
            <p className="mt-1 text-sm text-gray-600">
              Please enter your vehicle details. We'll verify them with the Department of Motor Traffic.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Number */}
              <div>
                <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
                  Vehicle Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('vehicleNumber', {
                    required: 'Vehicle number is required',
                    pattern: {
                      value: /^[A-Z]{2,3}\s[A-Z]{2,3}-\d{4}$/,
                      message: 'Invalid format (e.g., WP CAB-1234, NW BUS-5678)',
                    },
                    setValueAs: (value) => value?.toUpperCase(),
                  })}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="WP CAB-1234"
                />
                {errors.vehicleNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: [Province] [Type]-[Number] (e.g., WP CAB-1234)
                </p>
              </div>
              
              {/* Vehicle Type */}
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('vehicleType', {
                    required: 'Vehicle type is required',
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.vehicleType && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
                )}
              </div>
              
              {/* Fuel Type */}
              <div>
                <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                  Fuel Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('fuelType', {
                    required: 'Fuel type is required',
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select fuel type</option>
                  {fuelTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.fuelType && (
                  <p className="mt-1 text-sm text-red-600">{errors.fuelType.message}</p>
                )}
              </div>
              
              {/* Engine Capacity */}
              <div>
                <label htmlFor="engineCapacity" className="block text-sm font-medium text-gray-700">
                  Engine Capacity (CC)
                </label>
                <input
                  {...register('engineCapacity', {
                    valueAsNumber: true,
                    min: {
                      value: 50,
                      message: 'Engine capacity must be at least 50cc',
                    },
                    max: {
                      value: 10000,
                      message: 'Engine capacity must be less than 10000cc',
                    },
                  })}
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1500"
                />
                {errors.engineCapacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.engineCapacity.message}</p>
                )}
              </div>
              
              {/* Make */}
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                  Make/Brand
                </label>
                <input
                  {...register('make')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Toyota"
                />
              </div>
              
              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  {...register('model')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Corolla"
                />
              </div>
              
              {/* Year of Manufacture */}
              <div>
                <label htmlFor="yearOfManufacture" className="block text-sm font-medium text-gray-700">
                  Year of Manufacture
                </label>
                <input
                  {...register('yearOfManufacture', {
                    valueAsNumber: true,
                    min: {
                      value: 1900,
                      message: 'Invalid year',
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: 'Year cannot be in the future',
                    },
                  })}
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2020"
                />
                {errors.yearOfManufacture && (
                  <p className="mt-1 text-sm text-red-600">{errors.yearOfManufacture.message}</p>
                )}
              </div>
            </div>
            
            {/* DMT Verification Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-blue-400"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">DMT Verification</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Your vehicle details will be verified with the Department of Motor Traffic database. 
                    Please ensure all information is accurate.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/vehicle-owner/vehicles"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
                    {verifying ? 'Verifying...' : 'Registering...'}
                  </div>
                ) : (
                  'Register Vehicle'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}