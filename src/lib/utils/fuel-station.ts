// src/lib/utils/fuel-station.ts

import { FuelStationResponse } from '@/types'

/**
 * Check if a fuel station is approved
 * Falls back to checking approvedAt if isApproved is not available
 */
export const isStationApproved = (station: FuelStationResponse | null): boolean => {
  if (!station) return false
  
  // If backend sends isApproved directly, use it
  if (typeof station.isApproved === 'boolean') {
    return station.isApproved
  }
  
  // Otherwise, check if approvedAt is set
  return !!station.approvedAt
}

/**
 * Get a display-friendly approval status
 */
export const getApprovalStatus = (station: FuelStationResponse | null): string => {
  if (!station) return 'Unknown'
  
  if (isStationApproved(station)) {
    return 'Approved'
  }
  
  return 'Pending Approval'
}

/**
 * Format station status for display
 */
export const getStationStatus = (station: FuelStationResponse | null): {
  label: string
  color: string
  bgColor: string
} => {
  if (!station) {
    return { label: 'Unknown', color: 'text-gray-700', bgColor: 'bg-gray-100' }
  }
  
  if (station.isActive) {
    return { label: 'Active', color: 'text-green-700', bgColor: 'bg-green-100' }
  }
  
  return { label: 'Inactive', color: 'text-red-700', bgColor: 'bg-red-100' }
}