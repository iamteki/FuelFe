import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, LogOut, Settings } from 'lucide-react'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FQ</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Fuel Quota Management
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {user?.username}
              </span>
              <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                {user?.role?.replace('ROLE_', '')}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
