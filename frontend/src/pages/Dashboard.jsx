import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Car, Fuel, MapPin, Clock, TrendingUp, AlertCircle } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()

  const stats = [
    {
      name: 'Registered Vehicles',
      value: '3',
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      name: 'Current Quota',
      value: '45.2L',
      icon: Fuel,
      color: 'bg-green-500'
    },
    {
      name: 'Nearby Stations',
      value: '12',
      icon: MapPin,
      color: 'bg-purple-500'
    },
    {
      name: 'Last Refuel',
      value: '2 days ago',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'refuel',
      description: 'Refueled ABC-1234 with 15L petrol',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'registration',
      description: 'Registered new vehicle XYZ-5678',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'quota_reset',
      description: 'Weekly quota reset for all vehicles',
      time: '3 days ago',
      status: 'completed'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600">
          Here's your fuel quota overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quota Status */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quota Status</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Weekly Quota Used</span>
              <span className="text-sm font-medium">65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>24.5L used of 38L weekly quota</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span>Quota resets in 2 days</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn btn-primary flex items-center justify-center space-x-2">
            <Car className="w-4 h-4" />
            <span>Register Vehicle</span>
          </button>
          <button className="btn btn-secondary flex items-center justify-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Find Fuel Stations</span>
          </button>
          <button className="btn btn-secondary flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>View History</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
