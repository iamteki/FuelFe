import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { vehicleAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { Car, Plus } from 'lucide-react'

const VehicleRegistration = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const vehicleTypes = [
    { value: 'CAR', label: 'Car' },
    { value: 'MOTORCYCLE', label: 'Motorcycle' },
    { value: 'THREE_WHEELER', label: 'Three Wheeler' },
    { value: 'VAN', label: 'Van' },
    { value: 'LORRY', label: 'Lorry' },
    { value: 'BUS', label: 'Bus' },
    { value: 'TRUCK', label: 'Truck' }
  ]

  const fuelTypes = [
    { value: 'PETROL', label: 'Petrol' },
    { value: 'DIESEL', label: 'Diesel' }
  ]

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      await vehicleAPI.register(data)
      toast.success('Vehicle registered successfully!')
      navigate('/my-vehicles')
    } catch (error) {
      toast.error(error.response?.data || 'Failed to register vehicle')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Car className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Register Vehicle</h1>
            <p className="text-gray-600">Add a new vehicle to your account</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Vehicle Registration Number */}
          <div>
            <label className="label">
              Vehicle Registration Number *
            </label>
            <input
              {...register('registrationNumber', { 
                required: 'Registration number is required',
                pattern: {
                  value: /^[A-Za-z0-9\-]+$/,
                  message: 'Invalid registration number format'
                }
              })}
              type="text"
              className="input"
              placeholder="ABC-1234"
              maxLength={20}
            />
            {errors.registrationNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
            )}
          </div>

          {/* Vehicle Make and Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Vehicle Make
              </label>
              <input
                {...register('make')}
                type="text"
                className="input"
                placeholder="Toyota"
              />
            </div>
            <div>
              <label className="label">
                Vehicle Model
              </label>
              <input
                {...register('model')}
                type="text"
                className="input"
                placeholder="Prius"
              />
            </div>
          </div>

          {/* Vehicle Type and Fuel Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Vehicle Type *
              </label>
              <select
                {...register('vehicleType', { required: 'Vehicle type is required' })}
                className="input"
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

            <div>
              <label className="label">
                Fuel Type *
              </label>
              <select
                {...register('fuelType', { required: 'Fuel type is required' })}
                className="input"
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
          </div>

          {/* Manufacture Year and Engine Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Manufacture Year
              </label>
              <input
                {...register('manufactureYear', {
                  min: { value: 1950, message: 'Year must be after 1950' },
                  max: { value: new Date().getFullYear() + 1, message: 'Invalid year' }
                })}
                type="number"
                className="input"
                placeholder="2020"
                min="1950"
                max={new Date().getFullYear() + 1}
              />
              {errors.manufactureYear && (
                <p className="mt-1 text-sm text-red-600">{errors.manufactureYear.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                Engine Capacity (CC)
              </label>
              <input
                {...register('engineCapacity', {
                  min: { value: 50, message: 'Engine capacity must be at least 50cc' },
                  max: { value: 10000, message: 'Engine capacity seems too large' }
                })}
                type="number"
                className="input"
                placeholder="1800"
                min="50"
                max="10000"
              />
              {errors.engineCapacity && (
                <p className="mt-1 text-sm text-red-600">{errors.engineCapacity.message}</p>
              )}
            </div>
          </div>

          {/* Information Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Plus className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Vehicle Registration Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your weekly fuel quota will be calculated based on vehicle type and engine capacity</li>
                    <li>A QR code will be generated for your vehicle after registration</li>
                    <li>You can use this QR code at fuel stations for easy identification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Vehicle'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-vehicles')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VehicleRegistration
