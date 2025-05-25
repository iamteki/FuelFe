"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Mock data for the chart
const monthlyUsageData = [
  { month: "Jan", petrol92: 35, petrol95: 10, diesel: 0 },
  { month: "Feb", petrol92: 40, petrol95: 15, diesel: 0 },
  { month: "Mar", petrol92: 30, petrol95: 20, diesel: 0 },
  { month: "Apr", petrol92: 45, petrol95: 5, diesel: 0 },
  { month: "May", petrol92: 25, petrol95: 15, diesel: 0 },
  { month: "Jun", petrol92: 0, petrol95: 0, diesel: 0 },
]

const dieselUsageData = [
  { month: "Jan", diesel: 60 },
  { month: "Feb", diesel: 55 },
  { month: "Mar", diesel: 70 },
  { month: "Apr", diesel: 65 },
  { month: "May", diesel: 50 },
  { month: "Jun", diesel: 0 },
]

export function UsageCharts() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Monthly Fuel Consumption</CardTitle>
        <CardDescription>Fuel usage trends over the past 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="petrol">
          <TabsList>
            <TabsTrigger value="petrol">Petrol</TabsTrigger>
            <TabsTrigger value="diesel">Diesel</TabsTrigger>
          </TabsList>
          <TabsContent value="petrol" className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyUsageData}>
                <XAxis 
                  dataKey="month" 
                  stroke="#888888" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Liters', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Bar 
                  dataKey="petrol92" 
                  name="Petrol 92"
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="petrol95" 
                  name="Petrol 95"
                  fill="#a78bfa" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="diesel" className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dieselUsageData}>
                <XAxis 
                  dataKey="month" 
                  stroke="#888888" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Liters', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Bar 
                  dataKey="diesel" 
                  name="Diesel"
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
