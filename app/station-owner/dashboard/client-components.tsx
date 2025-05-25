"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Monitor, Container, Droplet, FileText, LineChart, MapPin, Store } from "lucide-react"

export function StationOwnerDashboardHeader() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              1 active station
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +5% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 min</div>
            <p className="text-xs text-muted-foreground">
              -2 min from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 152,400</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold">Fuel Inventory Summary</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Petrol 92</CardTitle>
            <Droplet className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Level</span>
              <span className="font-medium">15%</span>
            </div>
            <Progress 
              value={15}
              className="h-2"
              indicatorClassName="bg-red-500"
            />
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Updated: May 21, 2025 (14:30)</span>
              <span>Rs. 320/L</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Petrol 95</CardTitle>
            <Droplet className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Level</span>
              <span className="font-medium">60%</span>
            </div>
            <Progress 
              value={60}
              className="h-2"
              indicatorClassName="bg-amber-500"
            />
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Updated: May 21, 2025 (14:30)</span>
              <span>Rs. 350/L</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diesel</CardTitle>
            <Droplet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Level</span>
              <span className="font-medium">47%</span>
            </div>
            <Progress 
              value={47}
              className="h-2"
              indicatorClassName="bg-teal-500"
            />
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Updated: May 21, 2025 (14:30)</span>
              <span>Rs. 280/L</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Station Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Central Fuel Station</p>
                  <p className="text-sm text-muted-foreground">123 Main Street, Colombo 10100</p>
                </div>
              </div>
              <div className="flex items-center">
                <Container className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm">Registration: <span className="font-medium">FS-12345</span></p>
                </div>
              </div>
              <div className="flex items-center">
                <Store className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm">Status: <span className="text-green-600 font-medium">Active</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                  <span>Petrol 92 price updated</span>
                </div>
                <span className="text-muted-foreground text-xs">10:42 AM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                  <span>Diesel capacity updated</span>
                </div>
                <span className="text-muted-foreground text-xs">9:15 AM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span>Low stock alert: Petrol 92</span>
                </div>
                <span className="text-muted-foreground text-xs">Yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function StationOwnerActivityTabs() {
  return (
    <Tabs defaultValue="all">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="petrol">Petrol</TabsTrigger>
        <TabsTrigger value="diesel">Diesel</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="space-y-4 mt-4">
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-medium">ABC-1234</p>
            <p className="text-sm text-slate-500">May 18, 2025 • 10:23 AM</p>
          </div>
          <div className="text-right">
            <p className="font-medium">4.5 L</p>
            <p className="text-sm text-slate-500">Petrol</p>
          </div>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-medium">XYZ-5678</p>
            <p className="text-sm text-slate-500">May 18, 2025 • 09:15 AM</p>
          </div>
          <div className="text-right">
            <p className="font-medium">10.0 L</p>
            <p className="text-sm text-slate-500">Diesel</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">DEF-9012</p>
            <p className="text-sm text-slate-500">May 17, 2025 • 04:45 PM</p>
          </div>
          <div className="text-right">
            <p className="font-medium">5.5 L</p>
            <p className="text-sm text-slate-500">Petrol</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="petrol" className="space-y-4 mt-4">
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-medium">ABC-1234</p>
            <p className="text-sm text-slate-500">May 18, 2025 • 10:23 AM</p>
          </div>
          <div className="text-right">
            <p className="font-medium">4.5 L</p>
            <p className="text-sm text-slate-500">Petrol</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">DEF-9012</p>
            <p className="text-sm text-slate-500">May 17, 2025 • 04:45 PM</p>
          </div>
          <div className="text-right">
            <p className="font-medium">5.5 L</p>
            <p className="text-sm text-slate-500">Petrol</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="diesel" className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">XYZ-5678</p>
            <p className="text-sm text-slate-500">May 18, 2025 • 09:15 AM</p>
          </div>
          <div className="text-right">
            <p className="font-medium">10.0 L</p>
            <p className="text-sm text-slate-500">Diesel</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
