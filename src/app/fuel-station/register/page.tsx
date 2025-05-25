// src/app/fuel-station/register/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setMyStation } from '@/store/slices/fuelStationSlice'
import { fuelStationAPI } from '@/lib/api/fuel-station-api'
import { FuelStationRegistrationRequest } from '@/types'
import toast from 'react-hot-toast'

export default function FuelStationRegisterPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { myStation } = useSelector((state: RootState) => state.fuelStation)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [fetchingStation, setFetchingStation] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FuelStationRegistrationRequest>()

  useEffect(() => {
    fetchStationData()
  }, [])

  const fetchStationData = async () => {
    try {
      const station = await fuelStationAPI.getMyStation()
      dispatch(setMyStation(station))
      setIsEditing(true)
      
      // Populate form with existing data
      reset({
        registrationNumber: station.registrationNumber,
        stationName: station.stationName,
        address: station.address,
        district: station.district || '',
        province: station.province || '',
        latitude: station.latitude?.toString() || '',
        longitude: station.longitude?.toString() || '',
        contactNumber: station.contactNumber || '',
      } as any)
    } catch (error) {
      // No station registered yet
      console.log('No station found')
    } finally {
      setFetchingStation(false)
    }
  }

  const onSubmit = async (data: FuelStationRegistrationRequest) => {
    try {
      setIsLoading(true)
      
      // Convert string values to numbers for lat/lng
      const requestData = {
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude as any) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude as any) : undefined,
      }
      
      if (isEditing && myStation) {
        const updated = await fuelStationAPI.updateStation(myStation.id, requestData)
        dispatch(setMyStation({ ...myStation, ...updated }))
        toast.success('Fuel station updated successfully!')
      } else {
        const newStation = await fuelStationAPI.register(requestData)
        const stationResponse = await fuelStationAPI.getMyStation()
        dispatch(setMyStation(stationResponse))
        toast.success('Fuel station registered successfully!')
      }
      
      router.push('/fuel-station/dashboard')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (fetchingStation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isEditing ? 'Edit Fuel Station' : 'Register Fuel Station'}
          </h1>
          <p className="text-gray-600">
            {isEditing 
              ? 'Update your fuel station information' 
              : 'Register your fuel station to start managing fuel distribution'}
          </p>
        </div>

        {myStation && !myStation.isApproved && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <i className="fas fa-info-circle text-yellow-600 mr-3"></i>
              <p className="text-yellow-800">
                Your station is pending admin approval. You can still update details.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Number */}
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('registrationNumber', {
                  required: 'Registration number is required',
                  maxLength: {
                    value: 50,
                    message: 'Registration number cannot exceed 50 characters',
                  },
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter registration number"
                disabled={isEditing}
              />
              {errors.registrationNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
              )}
            </div>

            {/* Station Name */}
            <div>
              <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-1">
                Station Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('stationName', {
                  required: 'Station name is required',
                  maxLength: {
                    value: 100,
                    message: 'Station name cannot exceed 100 characters',
                  },
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter station name"
              />
              {errors.stationName && (
                <p className="mt-1 text-sm text-red-600">{errors.stationName.message}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                {...register('contactNumber', {
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: 'Invalid contact number format',
                  },
                })}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0771234567"
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber.message}</p>
              )}
            </div>

            {/* District */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <input
                {...register('district', {
                  maxLength: {
                    value: 50,
                    message: 'District cannot exceed 50 characters',
                  },
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter district"
              />
              {errors.district && (
                <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
              )}
            </div>

            {/* Province */}
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                Province
              </label>
              <select
                {...register('province')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Province</option>
                <option value="Western">Western</option>
                <option value="Central">Central</option>
                <option value="Southern">Southern</option>
                <option value="Northern">Northern</option>
                <option value="Eastern">Eastern</option>
                <option value="North Western">North Western</option>
                <option value="North Central">North Central</option>
                <option value="Uva">Uva</option>
                <option value="Sabaragamuwa">Sabaragamuwa</option>
              </select>
            </div>

            {/* Latitude */}
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                {...register('latitude', {
                  min: {
                    value: -90,
                    message: 'Invalid latitude',
                  },
                  max: {
                    value: 90,
                    message: 'Invalid latitude',
                  },
                })}
                type="number"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="6.9271"
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
              )}
            </div>

            {/* Longitude */}
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                {...register('longitude', {
                  min: {
                    value: -180,
                    message: 'Invalid longitude',
                  },
                  max: {
                    value: 180,
                    message: 'Invalid longitude',
                  },
                })}
                type="number"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="79.8612"
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
              )}
            </div>
          </div>

          {/* Address - Full width */}
          <div className="mt-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('address', {
                required: 'Address is required',
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter complete address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/fuel-station/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="spinner small mr-2"></div>
                  {isEditing ? 'Updating...' : 'Registering...'}
                </div>
              ) : (
                <>{isEditing ? 'Update Station' : 'Register Station'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}