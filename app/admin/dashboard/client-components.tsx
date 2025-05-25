"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"

const fuelConsumptionData = [
  { day: "Mon", petrol: 12500, diesel: 9800 },
  { day: "Tue", petrol: 14200, diesel: 10500 },
  { day: "Wed", petrol: 15800, diesel: 11200 },
  { day: "Thu", petrol: 16500, diesel: 12000 },
  { day: "Fri", petrol: 18200, diesel: 13500 },
  { day: "Sat", petrol: 19500, diesel: 14200 },
  { day: "Sun", petrol: 15800, diesel: 10800 },
]

const registrationData = [
  { month: "Jan", vehicles: 1250, stations: 12 },
  { month: "Feb", vehicles: 1580, stations: 15 },
  { month: "Mar", vehicles: 1890, stations: 18 },
  { month: "Apr", vehicles: 2150, stations: 22 },
  { month: "May", vehicles: 2420, stations: 25 },
]

export function FuelConsumptionChart() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant={timeRange === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("week")}
          className={timeRange === "week" ? "bg-gradient-to-r from-amber-500 to-orange-600" : ""}
        >
          Week
        </Button>
        <Button
          variant={timeRange === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("month")}
          className={timeRange === "month" ? "bg-gradient-to-r from-amber-500 to-orange-600" : ""}
        >
          Month
        </Button>
        <Button
          variant={timeRange === "year" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("year")}
          className={timeRange === "year" ? "bg-gradient-to-r from-amber-500 to-orange-600" : ""}
        >
          Year
        </Button>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fuelConsumptionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="petrol" name="Petrol (L)" fill="#8b5cf6" />
            <Bar dataKey="diesel" name="Diesel (L)" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function RegistrationTrendsChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={registrationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="vehicles"
            name="Vehicles"
            stroke="#8b5cf6"
            activeDot={{ r: 8 }}
          />
          <Line yAxisId="right" type="monotone" dataKey="stations" name="Stations" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AdminDashboardCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-1 md:col-span-2 border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fuel Consumption</CardTitle>
            <CardDescription>Daily fuel consumption across all stations</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <FuelConsumptionChart />
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Registration Trends</CardTitle>
          <CardDescription>Monthly vehicle and station registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationTrendsChart />
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminPendingApprovalsTabs() {
  return (
    <Tabs defaultValue="vehicles">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        <TabsTrigger value="stations">Stations</TabsTrigger>
      </TabsList>
      <TabsContent value="vehicles" className="space-y-4 mt-4">
        <div className="rounded-md border border-slate-200">
          <div className="grid grid-cols-3 gap-4 p-4 font-medium border-b">
            <div>Owner</div>
            <div>Vehicle</div>
            <div>Status</div>
          </div>

          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 p-4">
                <div>John Doe</div>
                <div className="text-slate-500">Toyota Corolla (ABC-{1234 + i})</div>
                <div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200"
          asChild
        >
          <Link href="/admin/dashboard/vehicle-owners">View All Pending Vehicles</Link>
        </Button>
      </TabsContent>
      <TabsContent value="stations" className="space-y-4 mt-4">
        <div className="rounded-md border border-slate-200">
          <div className="grid grid-cols-3 gap-4 p-4 font-medium border-b">
            <div>Owner</div>
            <div>Station</div>
            <div>Status</div>
          </div>

          <div className="divide-y">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 p-4">
                <div>Sarah Johnson</div>
                <div className="text-slate-500">City Fuel Station {i + 1}</div>
                <div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200"
          asChild
        >
          <Link href="/admin/dashboard/fuel-stations">View All Pending Stations</Link>
        </Button>
      </TabsContent>
    </Tabs>
  )
}
