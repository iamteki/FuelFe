// src/app/admin/fuel-stations/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api/admin-api'
import { fuelStationAPI } from '@/lib/api/fuel-station-api'
import { FuelStationResponse } from '@/types'
import { isStationApproved } from '@/lib/utils/fuel-station'
import toast from 'react-hot-toast'

export default function AdminFuelStations() {
  const [pendingStations, setPendingStations] = useState<FuelStationResponse[]>([])
  const [allStations, setAllStations] = useState<FuelStationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchStations()
  }, [])

  const fetchStations = async () => {
    try {
      setLoading(true)
      const [pending, all] = await Promise.all([
        adminAPI.getPendingFuelStations(),
        fuelStationAPI.getAllStations()
      ])
      setPendingStations(pending)
      setAllStations(all)
    } catch (error) {
      toast.error('Failed to load fuel stations')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (stationId: number) => {
    try {
      setActionLoading(stationId)
      await adminAPI.approveFuelStation(stationId)
      toast.success('Fuel station approved successfully')
      await fetchStations()
    } catch (error) {
      toast.error('Failed to approve fuel station')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (stationId: number) => {
    if (!confirm('Are you sure you want to reject this fuel station?')) return
    
    try {
      setActionLoading(stationId)
      await adminAPI.rejectFuelStation(stationId)
      toast.success('Fuel station rejected')
      await fetchStations()
    } catch (error) {
      toast.error('Failed to reject fuel station')
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

  const displayStations = activeTab === 'pending' ? pendingStations : allStations

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Fuel Stations Management</h1>
        <p className="text-gray-600">Approve and manage fuel stations</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Approval
            {pendingStations.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                {pendingStations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Stations
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {allStations.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Stations List */}
      {displayStations.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Station Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayStations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{station.stationName}</div>
                        <div className="text-sm text-gray-500">{station.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {station.registrationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{station.ownerName}</div>
                        <div className="text-sm text-gray-500">{station.ownerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {station.district || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {station.contactNumber || station.ownerPhoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          station.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {station.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isStationApproved(station)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isStationApproved(station) ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!isStationApproved(station) && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(station.id)}
                            disabled={actionLoading === station.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            {actionLoading === station.id ? (
                              <div className="spinner small"></div>
                            ) : (
                              'Approve'
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(station.id)}
                            disabled={actionLoading === station.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {isStationApproved(station) && (
                        <span className="text-gray-400 text-xs">
                          Approved on {new Date(station.approvedAt!).toLocaleDateString()}
                        </span>
                      )}
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
            <i className="fas fa-gas-pump text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'pending' ? 'No Pending Fuel Stations' : 'No Fuel Stations Found'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'pending' 
                ? 'All fuel stations have been reviewed'
                : 'No fuel stations have been registered yet'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}