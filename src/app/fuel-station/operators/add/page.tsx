// src/app/fuel-station/operators/add/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addOperator } from '@/store/slices/fuelStationSlice'
import { fuelStationAPI } from '@/lib/api/fuel-station-api'
import { OperatorRegistrationRequest } from '@/types'
import toast from 'react-hot-toast'

export default function AddOperatorPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OperatorRegistrationRequest>()

  const onSubmit = async (data: OperatorRegistrationRequest) => {
    try {
      setIsLoading(true)
      const newOperator = await fuelStationAPI.registerOperator(data)
      dispatch(addOperator(newOperator))
      toast.success('Operator registered successfully!')
      router.push('/fuel-station/operators')
    } catch (error: any) {
      console.error('Error registering operator:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/fuel-station/operators')}
            className="text-gray-600 hover:text-gray-800 mb-4 inline-flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Operators
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Operator</h1>
          <p className="text-gray-600">
            Register a new operator who can use the mobile app to pump fuel
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Employee Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Employee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('employeeId', {
                      required: 'Employee ID is required',
                      maxLength: {
                        value: 50,
                        message: 'Employee ID cannot exceed 50 characters',
                      },
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="EMP001"
                  />
                  {errors.employeeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('fullName', {
                      required: 'Full name is required',
                      maxLength: {
                        value: 100,
                        message: 'Full name cannot exceed 100 characters',
                      },
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Login Credentials Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Login Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 4,
                        message: 'Username must be at least 4 characters',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Username cannot exceed 50 characters',
                      },
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="johndoe"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...register('phoneNumber', {
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: 'Invalid phone number format',
                      },
                    })}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0771234567"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              Important Information
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• The operator will use these credentials to login to the mobile app</li>
              <li>• Make sure to share the username and password securely with the operator</li>
              <li>• Operators can only scan QR codes and pump fuel at your station</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/fuel-station/operators')}
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
                  Registering...
                </div>
              ) : (
                'Register Operator'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}