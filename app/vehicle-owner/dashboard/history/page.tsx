"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Filter } from "lucide-react"
import { FilterControls, ExportButton } from "./client-components"
import { UsageCharts } from "./usage-charts"

// Mock data for usage history
const fuelTransactions = [
  {
    id: "TX-123456",
    date: "2025-05-20T09:30:00",
    station: "Fuel Express Station",
    fuelType: "Petrol 92",
    amount: "10.5 liters",
    cost: "Rs. 3,150.00",
    vehicle: "Toyota Corolla (ABC-1234)",
  },
  {
    id: "TX-123457",
    date: "2025-05-15T14:20:00",
    station: "CeylonFuel Downtown",
    fuelType: "Petrol 95",
    amount: "15.0 liters",
    cost: "Rs. 4,800.00",
    vehicle: "Toyota Corolla (ABC-1234)",
  },
  {
    id: "TX-123458",
    date: "2025-05-10T11:45:00",
    station: "EnergyPlus Station",
    fuelType: "Diesel",
    amount: "20.0 liters",
    cost: "Rs. 5,400.00",
    vehicle: "Honda Civic (XYZ-5678)",
  },
  {
    id: "TX-123459",
    date: "2025-05-05T16:15:00",
    station: "Fuel Express Station",
    fuelType: "Petrol 92",
    amount: "8.5 liters",
    cost: "Rs. 2,550.00",
    vehicle: "Toyota Corolla (ABC-1234)",
  },
  {
    id: "TX-123460",
    date: "2025-04-28T10:00:00",
    station: "CeylonFuel Highway",
    fuelType: "Petrol 95",
    amount: "12.0 liters",
    cost: "Rs. 3,840.00",
    vehicle: "Toyota Corolla (ABC-1234)",
  },
]

const quotaUpdates = [
  {
    id: "QU-123456",
    date: "2025-05-01T00:00:00",
    vehicle: "Toyota Corolla (ABC-1234)",
    fuelType: "Petrol 92",
    previousAllocation: "60.0 liters",
    newAllocation: "60.0 liters",
    reason: "Monthly quota reset",
  },
  {
    id: "QU-123457",
    date: "2025-04-01T00:00:00",
    vehicle: "Toyota Corolla (ABC-1234)",
    fuelType: "Petrol 92",
    previousAllocation: "60.0 liters",
    newAllocation: "60.0 liters",
    reason: "Monthly quota reset",
  },
  {
    id: "QU-123458",
    date: "2025-05-01T00:00:00",
    vehicle: "Honda Civic (XYZ-5678)",
    fuelType: "Diesel",
    previousAllocation: "80.0 liters",
    newAllocation: "80.0 liters",
    reason: "Monthly quota reset",
  },
  {
    id: "QU-123459",
    date: "2025-04-01T00:00:00",
    vehicle: "Honda Civic (XYZ-5678)",
    fuelType: "Diesel",
    previousAllocation: "80.0 liters",
    newAllocation: "80.0 liters",
    reason: "Monthly quota reset",
  },
]

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function UsageHistoryPage() {
  const [activeTab, setActiveTab] = useState("transactions")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage History</h1>
          <p className="text-muted-foreground">
            View your fuel usage history and quota allocation history
          </p>
        </div>
        <ExportButton />
      </div>
      
      <UsageCharts />

      <Card>
        <CardHeader className="px-6">
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Track all your fuel transactions and quota allocations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs
            defaultValue="transactions"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 border-b">
              <TabsList className="w-full justify-start h-12 bg-transparent p-0">
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-violet-500 data-[state=active]:shadow-none rounded-none h-12"
                >
                  Fuel Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="allocations"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-violet-500 data-[state=active]:shadow-none rounded-none h-12"
                >
                  Quota Allocations
                </TabsTrigger>              </TabsList>
            </div>
            <TabsContent value="transactions" className="m-0">
              <div className="px-6 pt-4">
                <FilterControls />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Fuel Station</TableHead>
                      <TableHead>Fuel Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Vehicle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>{transaction.station}</TableCell>
                        <TableCell>{transaction.fuelType}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.cost}</TableCell>
                        <TableCell>{transaction.vehicle}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="allocations" className="m-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Fuel Type</TableHead>
                      <TableHead>Previous Allocation</TableHead>
                      <TableHead>New Allocation</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotaUpdates.map((update) => (
                      <TableRow key={update.id}>
                        <TableCell className="font-medium">{update.id}</TableCell>
                        <TableCell>{formatDate(update.date)}</TableCell>
                        <TableCell>{update.vehicle}</TableCell>
                        <TableCell>{update.fuelType}</TableCell>
                        <TableCell>{update.previousAllocation}</TableCell>
                        <TableCell>{update.newAllocation}</TableCell>
                        <TableCell>{update.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
