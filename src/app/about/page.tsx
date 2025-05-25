'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <i className="fas fa-gas-pump text-white text-xl"></i>
                </div>
                <span className="ml-3 font-bold text-xl text-gray-800">Fuel Quota System</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Fuel Quota System</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing fuel distribution management during critical times through innovative technology and fair allocation systems.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Mission
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                In times of fuel crisis, ensuring fair and efficient distribution becomes paramount. Our Fuel Quota Management System was born from the need to create a transparent, accountable, and user-friendly platform that serves both citizens and fuel station operators.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                We believe that technology can bridge the gap between limited resources and public needs, creating a system that benefits everyone while maintaining order during challenging times.
              </p>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg"
                >
                  Join Our Platform
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1476&auto=format&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Principles that guide our mission to serve the community
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mx-auto">
                <i className="fas fa-balance-scale text-2xl"></i>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Fairness</h3>
              <p className="mt-2 text-gray-600">
                Equal opportunity for all citizens to access fuel based on their registered vehicles
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mx-auto">
                <i className="fas fa-shield-alt text-2xl"></i>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Security</h3>
              <p className="mt-2 text-gray-600">
                Advanced QR code technology and verification systems prevent fraud
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mx-auto">
                <i className="fas fa-chart-line text-2xl"></i>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Transparency</h3>
              <p className="mt-2 text-gray-600">
                Real-time tracking and reporting of all fuel transactions
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mx-auto">
                <i className="fas fa-bolt text-2xl"></i>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Efficiency</h3>
              <p className="mt-2 text-gray-600">
                Quick verification and minimal waiting times at fuel stations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Simple steps to get your fuel quota
            </p>
          </div>
          
          <div className="mt-16">
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 transform -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 relative">
                {/* Step 1 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold mb-4">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Register</h3>
                    <p className="text-gray-600">
                      Create your account and verify your identity through the platform
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold mb-4">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Vehicles</h3>
                    <p className="text-gray-600">
                      Register your vehicles with DMT verification
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold mb-4">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Get QR Code</h3>
                    <p className="text-gray-600">
                      Receive unique QR codes for each verified vehicle
                    </p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold mb-4">
                      4
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Refuel</h3>
                    <p className="text-gray-600">
                      Visit any registered fuel station and scan your QR code
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Making a Difference
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Our impact in numbers
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">10K+</p>
              <p className="mt-2 text-lg text-blue-100">Registered Users</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">25K+</p>
              <p className="mt-2 text-lg text-blue-100">Verified Vehicles</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">500+</p>
              <p className="mt-2 text-lg text-blue-100">Fuel Stations</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">1M+</p>
              <p className="mt-2 text-lg text-blue-100">Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Dedicated professionals working to serve you better
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600">
                <div className="flex items-center justify-center h-full w-full text-white">
                  <i className="fas fa-user-tie text-6xl"></i>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">John Perera</h3>
              <p className="text-gray-600">Chief Executive Officer</p>
            </div>
            
            <div className="text-center">
              <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600">
                <div className="flex items-center justify-center h-full w-full text-white">
                  <i className="fas fa-user text-6xl"></i>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Sarah Silva</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
            </div>
            
            <div className="text-center">
              <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600">
                <div className="flex items-center justify-center h-full w-full text-white">
                  <i className="fas fa-user text-6xl"></i>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Kumar Fernando</h3>
              <p className="text-gray-600">Head of Operations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Get in Touch
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Have questions or need assistance? Our team is here to help.
                </p>
                
                <div className="mt-8 space-y-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-envelope text-blue-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900 font-medium">Email</p>
                      <p className="text-gray-600">support@fuelquota.gov.lk</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-phone text-blue-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900 font-medium">Phone</p>
                      <p className="text-gray-600">+94 11 234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-blue-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900 font-medium">Office</p>
                      <p className="text-gray-600">123 Galle Road, Colombo 03</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-12 text-white">
                <h3 className="text-2xl font-bold mb-6">Office Hours</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-xl font-semibold mb-4">Emergency Hotline</h4>
                  <p className="text-2xl font-bold">1919</p>
                  <p className="text-blue-100 mt-2">Available 24/7 for urgent assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <i className="fas fa-gas-pump text-white text-lg"></i>
              </div>
              <span className="ml-2 font-bold text-lg text-white">Fuel Quota System</span>
            </div>
            <p className="text-center text-sm text-gray-400">
              © 2024 Fuel Quota Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}