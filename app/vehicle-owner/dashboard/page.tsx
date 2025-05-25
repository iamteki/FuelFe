import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight, Car, Droplet, QrCode } from "lucide-react"
import { VehicleOwnerActivityTabs } from "./client-components"

// Force static rendering
export const dynamic = "force-static"

export default function VehicleOwnerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Last updated: May 21, 2025</span>
        </div>
      </div>



      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Petrol Quota</CardTitle>
            <Droplet className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.5 L</div>
            <p className="text-xs text-slate-500">of 20 L monthly allocation</p>
            <Progress
              value={77.5}
              className="mt-3 h-2 bg-slate-200"
              indicatorClassName="bg-gradient-to-r from-violet-500 to-purple-600"
            />
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diesel Quota</CardTitle>
            <Droplet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 L</div>
            <p className="text-xs text-slate-500">No diesel allocation for this vehicle</p>
            <Progress value={0} className="mt-3 h-2 bg-slate-200" />
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Vehicles</CardTitle>
            <Car className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-slate-500">Toyota Corolla (ABC-1234)</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
              asChild
            >
              <Link href="/vehicle-owner/dashboard/vehicles">
                View details <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Access your most important features</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              className="w-full justify-start gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              asChild
            >
              <Link href="/vehicle-owner/dashboard/qr-code">
                <QrCode className="h-4 w-4" />
                Generate QR Code
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/vehicle-owner/dashboard/vehicles">
                <Car className="h-4 w-4" />
                Register New Vehicle
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/vehicle-owner/dashboard/history">
                <Droplet className="h-4 w-4" />
                View Fuel Usage History
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent fuel transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <VehicleOwnerActivityTabs />
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
              asChild
            >
              <Link href="/vehicle-owner/dashboard/history">
                View all transactions <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
