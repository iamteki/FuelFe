// src/app/fuel-station/profile/page.tsx
'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { useForm } from 'react-hook-form'
import { isStationApproved } from '@/lib/utils/fuel-station'
import { fuelStationAPI } from '@/lib/api/fuel-station-api'
import { loginSuccess } from '@/store/slices/authSlice'
import toast from 'react-hot-toast'

interface ProfileUpdateRequest {
  email: string
  phoneNumber: string
  currentPassword: string
  newPassword?: string
  confirmPassword?: string
}

export default function FuelStationProfilePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { myStation } = useSelector((state: RootState) => state.fuelStation)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProfileUpdateRequest>({
    defaultValues: {
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || myStation?.ownerPhoneNumber || '',
    }
  })

  const newPassword = watch('newPassword')

  const onSubmit = async (data: ProfileUpdateRequest) => {
    try {
      setIsLoading(true)
      
      // Prepare the update data
      const updateData: any = {
        email: data.email,
        phoneNumber: data.phoneNumber,
      }
      
      // If password is being changed
      if (data.newPassword) {
        const passwordData = {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }
        
        // Update password
        await fuelStationAPI.changePassword(passwordData)
      }
      
      // Update profile
      const updatedUser = await fuelStationAPI.updateProfile(updateData)
      
      // Update the auth state with new user data
      if (user) {
        dispatch(loginSuccess({
          user: {
            ...user,
            email: data.email,
            phoneNumber: data.phoneNumber,
          },
          token: localStorage.getItem('token') || ''
        }))
        
        // Also update localStorage
        const updatedUserData = {
          ...user,
          email: data.email,
          phoneNumber: data.phoneNumber,
        }
        localStorage.setItem('user', JSON.stringify(updatedUserData))
      }
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      reset()
    } catch (error: any) {
      // Error will be handled by axios interceptor
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and security settings</p>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>
          </div>
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                    <p className="text-gray-900">{user?.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                    <p className="text-gray-900">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        Fuel Station Owner
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    <p className="text-gray-900">{user?.phoneNumber || myStation?.ownerPhoneNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      // Reset form with current values including phone number
                      reset({
                        email: user?.email || '',
                        phoneNumber: user?.phoneNumber || myStation?.ownerPhoneNumber || '',
                      })
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
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
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-medium text-gray-800 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register('currentPassword', {
                            required: 'Current password is required to save changes',
                          })}
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <i className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          {...register('newPassword', {
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters',
                            },
                          })}
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                          placeholder="Leave blank to keep current"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        {...register('confirmPassword', {
                          validate: (value) => {
                            if (newPassword && value !== newPassword) {
                              return 'Passwords do not match'
                            }
                            return true
                          },
                        })}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm new password"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      reset()
                    }}
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
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Fuel Station Information Card */}
        {myStation && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Fuel Station Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Station Name</label>
                  <p className="text-gray-900">{myStation.stationName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Registration Number</label>
                  <p className="text-gray-900">{myStation.registrationNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">District</label>
                  <p className="text-gray-900">{myStation.district || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
                  <p className="text-gray-900">{myStation.contactNumber || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Owner Phone</label>
                  <p className="text-gray-900">{myStation.ownerPhoneNumber || user?.phoneNumber || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                  <p className="text-gray-900">{myStation.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      myStation.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {myStation.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isStationApproved(myStation)
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {isStationApproved(myStation) ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total Operators</label>
                  <p className="text-gray-900">{myStation.operatorCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}