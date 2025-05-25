// src/app/fuel-station/operators/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { setOperators } from '@/store/slices/fuelStationSlice'
import { fuelStationAPI } from '@/lib/api/fuel-station-api'
import { FuelStationOperator } from '@/types'
import { isStationApproved } from '@/lib/utils/fuel-station'
import toast from 'react-hot-toast'

export default function OperatorsPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { operators, myStation } = useSelector((state: RootState) => state.fuelStation)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchOperators()
  }, [])

  const fetchOperators = async () => {
    try {
      setLoading(true)
      
      // Check if station exists first
      if (!myStation) {
        const station = await fuelStationAPI.getMyStation()
        if (!station) {
          router.push('/fuel-station/register')
          return
        }
      }
      
      const operatorsList = await fuelStationAPI.getOperators()
      dispatch(setOperators(operatorsList))
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Please register your fuel station first')
        router.push('/fuel-station/register')
      } else {
        toast.error('Failed to load operators')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (operator: FuelStationOperator) => {
    try {
      setActionLoading(operator.id)
      
      if (operator.isActive) {
        await fuelStationAPI.deactivateOperator(operator.id)
        toast.success('Operator deactivated successfully')
      } else {
        await fuelStationAPI.activateOperator(operator.id)
        toast.success('Operator activated successfully')
      }
      
      // Refresh operators list
      await fetchOperators()
    } catch (error) {
      toast.error('Failed to update operator status')
    } finally {
      setActionLoading(null)
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Fuel Station Operators</h1>
          <p className="text-gray-600">Manage your fuel station operators</p>
        </div>
        <button
          onClick={() => router.push('/fuel-station/operators/add')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Operator
        </button>
      </div>

      {/* Station Alert */}
      {myStation && !isStationApproved(myStation) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-info-circle text-yellow-600 mr-3"></i>
            <p className="text-yellow-800">
              Your station is pending approval. Operators can be added but won't be able to pump fuel until approved.
            </p>
          </div>
        </div>
      )}

      {/* Operators List */}
      {operators.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {operators.map((operator) => (
                  <tr key={operator.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {operator.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {operator.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operator.user?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operator.user?.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        operator.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {operator.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(operator.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleStatus(operator)}
                        disabled={actionLoading === operator.id}
                        className={`${
                          operator.isActive
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {actionLoading === operator.id ? (
                          <div className="spinner small"></div>
                        ) : (
                          operator.isActive ? 'Deactivate' : 'Activate'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12">
          <div className="text-center">
            <i className="fas fa-users text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Operators Yet</h3>
            <p className="text-gray-500 mb-6">
              Add operators to allow them to scan QR codes and pump fuel
            </p>
            <button
              onClick={() => router.push('/fuel-station/operators/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Add First Operator
            </button>
          </div>
        </div>
      )}

      {/* Operator Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          <i className="fas fa-info-circle mr-2"></i>
          Operator Instructions
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Operators must use the mobile app to scan vehicle QR codes and pump fuel</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Each operator needs a unique username and employee ID</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Deactivated operators cannot access the mobile app</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Operators can only work at your fuel station</span>
          </li>
        </ul>
      </div>
    </div>
  )
}