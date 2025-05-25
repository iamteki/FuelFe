import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight, Car, Droplet, MapPin, Users } from "lucide-react"
import { AdminDashboardCharts, AdminPendingApprovalsTabs } from "./client-components"

// Force static rendering
export const dynamic = "force-static"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Last updated: May 21, 2025</span>
        </div>
      </div>

      <Alert className="bg-blue-50 border border-blue-200 text-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-800 font-medium">System Maintenance</AlertTitle>
        <AlertDescription className="text-blue-700">
          Scheduled maintenance on May 25, 2025 from 2:00 AM to 4:00 AM. The system may be unavailable during this time.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Vehicles</CardTitle>
            <Car className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,892</div>
            <p className="text-xs text-slate-500">+124 since yesterday</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Stations</CardTitle>
            <MapPin className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-slate-500">+3 since last week</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Dispensed</CardTitle>
            <Droplet className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112,540 L</div>
            <p className="text-xs text-slate-500">This week</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,453</div>
            <p className="text-xs text-slate-500">+842 since last week</p>
          </CardContent>
        </Card>
      </div>

      <AdminDashboardCharts />

      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Items requiring administrator approval</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminPendingApprovalsTabs />
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Low Fuel Stock Alert</h3>
                <p className="text-sm text-amber-700">
                  Central Fuel Station is running low on diesel (15% remaining). Consider allocating additional supply.
                </p>
                <p className="text-xs text-amber-600 mt-1">May 21, 2025 • 10:15 AM</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Multiple Failed Login Attempts</h3>
                <p className="text-sm text-red-700">
                  Multiple failed login attempts detected for admin account "system_admin". IP has been temporarily
                  blocked.
                </p>
                <p className="text-xs text-red-600 mt-1">May 20, 2025 • 11:42 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">System Update Available</h3>
                <p className="text-sm text-blue-700">
                  A new system update (v2.5.3) is available. This update includes security patches and performance
                  improvements.
                </p>
                <p className="text-xs text-blue-600 mt-1">May 19, 2025 • 09:30 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            asChild
          >
            <Link href="/admin/dashboard/alerts">
              View all alerts <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
