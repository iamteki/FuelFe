// src/app/admin/settings/page.tsx
'use client'

export default function AdminSettings() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system parameters and settings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <i className="fas fa-cog text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
          <p className="text-gray-500">This feature is under development</p>
        </div>
      </div>
    </div>
  )
}