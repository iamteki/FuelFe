import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight, Droplet, MapPin, Scan } from "lucide-react"
import { StationOwnerDashboardHeader, StationOwnerActivityTabs } from "./client-components"

// Force static rendering
export const dynamic = "force-static"

export default function StationOwnerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Last updated: May 22, 2025 (Today)</span>
        </div>
      </div>

      <StationOwnerDashboardHeader />

      <Alert className="bg-amber-50 border border-amber-200 text-amber-800">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-800 font-medium">Station verification pending</AlertTitle>
        <AlertDescription className="text-amber-700">
          Your station registration is being verified. This usually takes 2-3 business days.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Petrol Allocation</CardTitle>
            <Droplet className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,500 L</div>
            <p className="text-xs text-slate-500">of 5,000 L weekly allocation</p>
            <Progress
              value={50}
              className="mt-3 h-2 bg-slate-200"
              indicatorClassName="bg-gradient-to-r from-teal-500 to-emerald-600"
            />
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diesel Allocation</CardTitle>
            <Droplet className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,200 L</div>
            <p className="text-xs text-slate-500">of 4,000 L weekly allocation</p>
            <Progress
              value={80}
              className="mt-3 h-2 bg-slate-200"
              indicatorClassName="bg-gradient-to-r from-teal-500 to-emerald-600"
            />
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Stations</CardTitle>
            <MapPin className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-slate-500">Central Fuel Station (Verified)</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              asChild
            >
              <Link href="/station-owner/dashboard/stations">
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
              className="w-full justify-start gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
              asChild
            >
              <Link href="/station-owner/dashboard/transactions">
                <Scan className="h-4 w-4" />
                Scan Customer QR Code
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/station-owner/dashboard/stations">
                <MapPin className="h-4 w-4" />
                Register New Station
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/station-owner/dashboard/inventory">
                <Droplet className="h-4 w-4" />
                Update Fuel Inventory
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your recent fuel dispensing transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <StationOwnerActivityTabs />
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              asChild
            >
              <Link href="/station-owner/dashboard/transactions">
                View all transactions <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Today's Statistics</CardTitle>
          <CardDescription>Overview of today's fuel dispensing activities</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-slate-500">Total Transactions</div>
            <div className="text-3xl font-bold">24</div>
            <div className="text-xs text-slate-500">+12% from yesterday</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-slate-500">Petrol Dispensed</div>
            <div className="text-3xl font-bold">120.5 L</div>
            <div className="text-xs text-slate-500">4.8% of weekly allocation</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-slate-500">Diesel Dispensed</div>
            <div className="text-3xl font-bold">85.0 L</div>
            <div className="text-xs text-slate-500">2.1% of weekly allocation</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
