'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { vehicleAPI } from '@/lib/api/vehicle-api'
import { qrAPI } from '@/lib/api/qr-api'
import { VehicleResponse, QRCodeResponse } from '@/types'

export default function VehicleDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null)
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (params.id) {
      fetchVehicleDetails()
    }
  }, [params.id])
  
  const fetchVehicleDetails = async () => {
    try {
      const vehicleId = Number(params.id)
      const [vehicleData, qrCodeData] = await Promise.all([
        vehicleAPI.getVehicleById(vehicleId),
        qrAPI.generateQRCode(vehicleId),
      ])
      setVehicle(vehicleData)
      setQrData(qrCodeData)
    } catch (error) {
      console.error('Failed to fetch vehicle details:', error)
      toast.error('Failed to load vehicle details')
      router.push('/vehicle-owner/vehicles')
    } finally {
      setLoading(false)
    }
  }
  
  const downloadQRCode = () => {
    if (!qrData) return
    
    // Create a temporary link element
    const link = document.createElement('a')
    link.download = `QR-${vehicle?.vehicleNumber}.png`
    link.href = qrData.qrImage
    link.click()
  }
  
  const printQRCode = () => {
    if (!qrData) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${vehicle?.vehicleNumber}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .container {
                text-align: center;
                padding: 20px;
              }
              h1 {
                margin-bottom: 10px;
              }
              img {
                margin: 20px 0;
                border: 2px solid #000;
                padding: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Fuel Quota QR Code</h1>
              <h2>Vehicle: ${vehicle?.vehicleNumber}</h2>
              <img src="${qrData.qrImage}" alt="QR Code" width="300" height="300" />
              <p>Scan this code at fuel stations</p>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }
  
  if (!vehicle || !qrData) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/vehicle-owner/vehicles" className="mr-4">
                <i className="fas fa-arrow-left text-gray-600 hover:text-gray-900"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Vehicle Details</h1>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Vehicle Number</span>
                <span className="font-medium">{vehicle.vehicleNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{vehicle.vehicleType}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Fuel Type</span>
                <span className="font-medium">{vehicle.fuelType}</span>
              </div>
              {vehicle.make && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Make</span>
                  <span className="font-medium">{vehicle.make}</span>
                </div>
              )}
              {vehicle.model && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium">{vehicle.model}</span>
                </div>
              )}
              {vehicle.yearOfManufacture && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium">{vehicle.yearOfManufacture}</span>
                </div>
              )}
              {vehicle.engineCapacity && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Engine Capacity</span>
                  <span className="font-medium">{vehicle.engineCapacity} CC</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Verification Status</span>
                <span className={`font-medium ${vehicle.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {vehicle.isVerified ? (
                    <>
                      <i className="fas fa-check-circle mr-1"></i>
                      Verified
                    </>
                  ) : (
                    <>
                      <i className="fas fa-times-circle mr-1"></i>
                      Not Verified
                    </>
                  )}
                </span>
              </div>
            </div>
            
            {/* Current Quota Info */}
            {vehicle.currentQuota && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Current Week Quota</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Allocated</span>
                    <span className="text-sm font-medium">{vehicle.currentQuota.allocatedQuota}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="text-sm font-medium text-green-600">{vehicle.currentQuota.remainingQuota}L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${100 - ((vehicle.currentQuota.remainingQuota / vehicle.currentQuota.allocatedQuota) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* QR Code Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h2>
            
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-lg">
                <img
                  src={qrData.qrImage}
                  alt="Vehicle QR Code"
                  className="w-64 h-64"
                />
              </div>
              
              <p className="mt-4 text-sm text-gray-600 text-center">
                Present this QR code at fuel stations to pump fuel
              </p>
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download
                </button>
                <button
                  onClick={printQRCode}
                  className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <i className="fas fa-print mr-2"></i>
                  Print
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Keep this QR code secure. Do not share it with unauthorized persons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}