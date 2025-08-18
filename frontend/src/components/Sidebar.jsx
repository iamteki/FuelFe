import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Home,
  Car,
  Plus,
  MapPin,
  History,
  Settings,
  Shield
} from 'lucide-react'

const Sidebar = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const isStationManager = user?.role === 'ROLE_STATION_MANAGER'

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Vehicles', href: '/my-vehicles', icon: Car },
    { name: 'Register Vehicle', href: '/register-vehicle', icon: Plus },
    { name: 'Fuel Stations', href: '/fuel-stations', icon: MapPin },
    { name: 'Transaction History', href: '/transactions', icon: History },
  ]

  if (isAdmin) {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: Shield })
  }

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 pt-16">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-3 py-2">
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">Settings</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
