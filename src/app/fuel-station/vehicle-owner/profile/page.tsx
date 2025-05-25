'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { RootState } from '@/store'
import { vehicleOwnerAPI } from '@/lib/api/vehicle-owner-api'
import { loginSuccess } from '@/store/slices/authSlice'

interface ProfileData {
  fullName: string
  email: string
  phoneNumber: string
  nic: string
  address: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileData>()
  
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm<PasswordData>()
  
  const newPassword = watch('newPassword')
  
  useEffect(() => {
    fetchProfile()
  }, [])
  
  const fetchProfile = async () => {
    try {
      const data = await vehicleOwnerAPI.getProfile()
      setProfile(data)
      
      // Now the ProfileDTO includes all user data
      resetProfile({
        fullName: data.fullName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        nic: data.nic || '',
        address: data.address || '',
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }
  
  const onProfileSubmit = async (data: ProfileData) => {
    try {
      await vehicleOwnerAPI.updateProfile({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
      })
      
      // Update the user in Redux store with new data
      if (user) {
        const updatedUser = {
          ...user,
          email: data.email,
          phoneNumber: data.phoneNumber,
        }
        dispatch(loginSuccess({
          user: updatedUser,
          token: localStorage.getItem('token') || '',
        }))
      }
      
      toast.success('Profile updated successfully')
      setIsEditMode(false)
      fetchProfile()
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }
  
  const onPasswordSubmit = async (data: PasswordData) => {
    try {
      await vehicleOwnerAPI.updateProfile({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password changed successfully')
      setShowPasswordChange(false)
      resetPassword()
    } catch (error) {
      console.error('Failed to change password:', error)
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
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            {!isEditMode && !showPasswordChange && (
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <i className="fas fa-edit mr-2"></i>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          
          {isEditMode ? (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    {...registerProfile('fullName', { required: 'Full name is required' })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {profileErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.fullName.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">NIC</label>
                  <input
                    {...registerProfile('nic')}
                    type="text"
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    {...registerProfile('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    {...registerProfile('phoneNumber', {
                      pattern: {
                      value: /^\+94[0-9]{9}$/,
                      message: 'Phone number must start with +94 followed by 9 digits (e.g., +94701234567)',
                    },
                    })}
                    type="tel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {profileErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.phoneNumber.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  {...registerProfile('address')}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false)
                    fetchProfile()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{profile?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">NIC</p>
                  <p className="font-medium">{profile?.nic}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{profile?.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{profile?.address || 'Not provided'}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Account Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-medium">{profile?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Type</p>
              <p className="font-medium">Vehicle Owner</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium">
                {profile?.createdAt 
                  ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Not available'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
          
          {showPasswordChange ? (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  {...registerPassword('currentPassword', {
                    required: 'Current password is required',
                  })}
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === newPassword || 'Passwords do not match',
                  })}
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false)
                    resetPassword()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <i className="fas fa-key mr-2"></i>
              Change Password
            </button>
          )}
        </div>
      </div>
    </div>
  )
}