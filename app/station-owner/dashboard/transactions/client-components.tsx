"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, QrCode, RefreshCw, Scan } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function QRScanDialog() {
  const [isScanning, setIsScanning] = useState(false)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [scanDialogOpen, setScanDialogOpen] = useState(false)

  const handleScanQR = () => {
    setIsScanning(true)
    setIsVerified(null)

    // Simulate scanning and verification
    setTimeout(() => {
      setIsScanning(false)
      setIsVerified(true)
    }, 2000)
  }

  const handleDispenseFuel = () => {
    toast({
      title: "Fuel dispensed successfully",
      description: "5.0L of Petrol has been dispensed to ABC-1234",
    })
    setScanDialogOpen(false)
    setIsVerified(null)
  }

  return (
    <Dialog open={scanDialogOpen} onOpenChange={setScanDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
          <Scan className="mr-2 h-4 w-4" />
          Scan QR Code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Customer QR Code</DialogTitle>
          <DialogDescription>Scan the QR code presented by the customer to verify and dispense fuel.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isVerified ? (
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mb-4 relative">
                {isScanning ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-teal-500 absolute animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                ) : (
                  <QrCode className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <Button
                onClick={handleScanQR}
                disabled={isScanning}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Scan QR Code"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <Check className="h-6 w-6 text-green-600 mr-2" />
                <span className="font-medium text-green-800">QR Code Verified</span>
              </div>

              <div className="grid gap-4 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium text-slate-500">Vehicle:</div>
                  <div>Toyota Corolla (ABC-1234)</div>

                  <div className="text-sm font-medium text-slate-500">Fuel Type:</div>
                  <div>Petrol</div>

                  <div className="text-sm font-medium text-slate-500">Requested Amount:</div>
                  <div>5.0 L</div>

                  <div className="text-sm font-medium text-slate-500">Owner:</div>
                  <div>John Doe</div>

                  <div className="text-sm font-medium text-slate-500">Valid Until:</div>
                  <div>{"11:30 AM"}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {isVerified ? (
            <Button
              onClick={handleDispenseFuel}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
            >
              Dispense Fuel
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setScanDialogOpen(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TransactionTabs() {
  // Mock transaction data with fixed values to avoid hydration issues
  const allTransactions = [
    { id: 1, vehicle: "ABC-1234", date: "May 22, 2025, 10:15 AM", fuelType: "Petrol", amount: "5.2", status: "Completed" },
    { id: 2, vehicle: "ABC-1235", date: "May 22, 2025, 9:15 AM", fuelType: "Petrol", amount: "4.8", status: "Completed" },
    { id: 3, vehicle: "XYZ-5678", date: "May 22, 2025, 8:45 AM", fuelType: "Diesel", amount: "12.5", status: "Completed" },
    { id: 4, vehicle: "ABC-1237", date: "May 21, 2025, 4:30 PM", fuelType: "Petrol", amount: "3.7", status: "Completed" },
    { id: 5, vehicle: "ABC-1238", date: "May 21, 2025, 3:15 PM", fuelType: "Petrol", amount: "6.1", status: "Completed" },
    { id: 6, vehicle: "XYZ-5679", date: "May 21, 2025, 2:20 PM", fuelType: "Diesel", amount: "15.0", status: "Completed" },
    { id: 7, vehicle: "ABC-1240", date: "May 21, 2025, 11:45 AM", fuelType: "Petrol", amount: "5.5", status: "Completed" },
    { id: 8, vehicle: "ABC-1241", date: "May 21, 2025, 10:30 AM", fuelType: "Diesel", amount: "10.2", status: "Completed" },
    { id: 9, vehicle: "ABC-1242", date: "May 20, 2025, 5:15 PM", fuelType: "Petrol", amount: "4.5", status: "Completed" },
    { id: 10, vehicle: "ABC-1243", date: "May 20, 2025, 4:00 PM", fuelType: "Petrol", amount: "2.9", status: "Completed" },
  ];

  const petrolTransactions = allTransactions.filter(tx => tx.fuelType === "Petrol");
  const dieselTransactions = allTransactions.filter(tx => tx.fuelType === "Diesel");

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All Transactions</TabsTrigger>
        <TabsTrigger value="petrol">Petrol</TabsTrigger>
        <TabsTrigger value="diesel">Diesel</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View all fuel dispensing transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                <div>Vehicle</div>
                <div>Date & Time</div>
                <div>Fuel Type</div>
                <div>Amount</div>
                <div>Status</div>
              </div>

              <div className="divide-y">
                {allTransactions.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-5 gap-4 p-4">
                    <div>{tx.vehicle}</div>
                    <div className="text-slate-500">{tx.date}</div>
                    <div>{tx.fuelType}</div>
                    <div>{tx.amount} L</div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <div className="text-sm text-slate-500">Page 1 of 3</div>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="petrol" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Petrol Transactions</CardTitle>
            <CardDescription>View all petrol dispensing transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                <div>Vehicle</div>
                <div>Date & Time</div>
                <div>Fuel Type</div>
                <div>Amount</div>
                <div>Status</div>
              </div>

              <div className="divide-y">
                {petrolTransactions.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-5 gap-4 p-4">
                    <div>{tx.vehicle}</div>
                    <div className="text-slate-500">{tx.date}</div>
                    <div>{tx.fuelType}</div>
                    <div>{tx.amount} L</div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <div className="text-sm text-slate-500">Page 1 of 2</div>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="diesel" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Diesel Transactions</CardTitle>
            <CardDescription>View all diesel dispensing transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                <div>Vehicle</div>
                <div>Date & Time</div>
                <div>Fuel Type</div>
                <div>Amount</div>
                <div>Status</div>
              </div>

              <div className="divide-y">
                {dieselTransactions.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-5 gap-4 p-4">
                    <div>{tx.vehicle}</div>
                    <div className="text-slate-500">{tx.date}</div>
                    <div>{tx.fuelType}</div>
                    <div>{tx.amount} L</div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <div className="text-sm text-slate-500">Page 1 of 1</div>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
