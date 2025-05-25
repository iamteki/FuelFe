'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { vehicleAPI } from '@/lib/api/vehicle-api'
import { qrAPI } from '@/lib/api/qr-api'
import { VehicleResponse, QRCodeResponse } from '@/types'

export default function QRCodesPage() {
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  
  useEffect(() => {
    fetchVehicles()
  }, [])
  
  const fetchVehicles = async () => {
    try {
      const data = await vehicleAPI.getMyVehicles()
      setVehicles(data)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }
  
  const downloadQRCode = async (vehicle: VehicleResponse) => {
    try {
      setDownloadingId(vehicle.id)
      const qrData = await qrAPI.generateQRCode(vehicle.id)
      
      // Create a temporary link element
      const link = document.createElement('a')
      link.download = `QR-${vehicle.vehicleNumber}.png`
      link.href = qrData.qrImage
      link.click()
      
      toast.success('QR code downloaded successfully')
    } catch (error) {
      console.error('Failed to download QR code:', error)
      toast.error('Failed to download QR code')
    } finally {
      setDownloadingId(null)
    }
  }
  
  const printQRCode = async (vehicle: VehicleResponse) => {
    try {
      const qrData = await qrAPI.generateQRCode(vehicle.id)
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code - ${vehicle.vehicleNumber}</title>
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
                  border: 2px solid #000;
                  border-radius: 10px;
                }
                h1 {
                  margin-bottom: 10px;
                  color: #1f2937;
                }
                h2 {
                  margin-bottom: 20px;
                  color: #4b5563;
                }
                img {
                  margin: 20px 0;
                  border: 1px solid #e5e7eb;
                  padding: 10px;
                  background: white;
                }
                .info {
                  margin-top: 20px;
                  text-align: left;
                  border-top: 1px solid #e5e7eb;
                  padding-top: 20px;
                }
                .info-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 10px;
                }
                .info-label {
                  font-weight: bold;
                  color: #6b7280;
                }
                .info-value {
                  color: #1f2937;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Fuel Quota QR Code</h1>
                <h2>Vehicle: ${vehicle.vehicleNumber}</h2>
                <img src="${qrData.qrImage}" alt="QR Code" width="300" height="300" />
                <div class="info">
                  <div class="info-row">
                    <span class="info-label">Vehicle Type:</span>
                    <span class="info-value">${vehicle.vehicleType}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Fuel Type:</span>
                    <span class="info-value">${vehicle.fuelType}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">${vehicle.isVerified ? 'Verified' : 'Not Verified'}</span>
                  </div>
                </div>
                <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                  Present this QR code at authorized fuel stations
                </p>
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
    } catch (error) {
      console.error('Failed to print QR code:', error)
      toast.error('Failed to print QR code')
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
              <h1 className="text-2xl font-bold text-gray-900">Vehicle QR Codes</h1>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <i className="fas fa-qrcode text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles registered</h3>
            <p className="text-gray-600 mb-6">Register a vehicle to generate QR codes</p>
            <Link
              href="/vehicle-owner/vehicles/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Register Vehicle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vehicle.vehicleNumber}</h3>
                      <p className="text-sm text-gray-600">{vehicle.vehicleType}</p>
                    </div>
                    {vehicle.isVerified ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i className="fas fa-check-circle mr-1"></i>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <i className="fas fa-exclamation-circle mr-1"></i>
                        Not Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fuel Type:</span>
                      <span className="font-medium">{vehicle.fuelType}</span>
                    </div>
                    {vehicle.make && vehicle.model && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                      </div>
                    )}
                  </div>
                  
                  {vehicle.isVerified ? (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
                        <i className="fas fa-qrcode text-4xl text-gray-400"></i>
                        <p className="text-xs text-gray-600 mt-2">QR Code Ready</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <Link
                          href={`/vehicle-owner/vehicles/${vehicle.id}`}
                          className="text-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <i className="fas fa-eye"></i>
                          <span className="sr-only">View</span>
                        </Link>
                        <button
                          onClick={() => downloadQRCode(vehicle)}
                          disabled={downloadingId === vehicle.id}
                          className="text-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          {downloadingId === vehicle.id ? (
                            <div className="spinner small mx-auto"></div>
                          ) : (
                            <>
                              <i className="fas fa-download"></i>
                              <span className="sr-only">Download</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => printQRCode(vehicle)}
                          className="text-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <i className="fas fa-print"></i>
                          <span className="sr-only">Print</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
                      <i className="fas fa-exclamation-triangle text-yellow-600 mb-2"></i>
                      <p className="text-sm text-yellow-800">
                        Vehicle verification pending. QR code will be available after verification.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            <i className="fas fa-info-circle mr-2"></i>
            How to use your QR Code
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Download or print your vehicle's QR code</li>
            <li>Present the QR code at authorized fuel stations</li>
            <li>The operator will scan your code to verify your quota</li>
            <li>Keep your QR code secure and do not share with others</li>
            <li>You can regenerate the QR code anytime from this page</li>
          </ul>
        </div>
      </div>
    </div>
  )
}