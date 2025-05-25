// src/app/admin/transactions/page.tsx
'use client'

export default function AdminTransactions() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Transaction Management</h1>
        <p className="text-gray-600">View all system transactions</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <i className="fas fa-receipt text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Management Coming Soon</h3>
          <p className="text-gray-500">This feature is under development</p>
        </div>
      </div>
    </div>
  )
}