"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress" 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Car, 
  ChevronDown, 
  Droplet, 
  FileText, 
  Fuel, 
  HistoryIcon, 
  PenSquare,
  Search
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const quotaCategories = [
  {
    id: "QC1001",
    vehicleType: "Car/Sedan",
    fuelType: "Petrol",
    weeklyQuota: 15,
    monthlyQuota: 60,
    lastUpdated: "May 15, 2025"
  },
  {
    id: "QC1002",
    vehicleType: "Car/Sedan",
    fuelType: "Diesel",
    weeklyQuota: 12,
    monthlyQuota: 48,
    lastUpdated: "May 15, 2025"
  },
  {
    id: "QC1003",
    vehicleType: "Van",
    fuelType: "Petrol",
    weeklyQuota: 20,
    monthlyQuota: 80,
    lastUpdated: "May 15, 2025"
  },
  {
    id: "QC1004",
    vehicleType: "Van",
    fuelType: "Diesel",
    weeklyQuota: 18,
    monthlyQuota: 72,
    lastUpdated: "May 15, 2025"
  },
  {
    id: "QC1005",
    vehicleType: "SUV",
    fuelType: "Petrol",
    weeklyQuota: 25,
    monthlyQuota: 100,
    lastUpdated: "May 15, 2025"
  },
  {
    id: "QC1006",
    vehicleType: "SUV",
    fuelType: "Diesel",
    weeklyQuota: 22,
    monthlyQuota: 88,
    lastUpdated: "May 15, 2025"
  },
  {
    id: "QC1007",
    vehicleType: "Motorcycle",
    fuelType: "Petrol",
    weeklyQuota: 5,
    monthlyQuota: 20,
    lastUpdated: "May 15, 2025"
  },
  {
    id: "QC1008",
    vehicleType: "Three-wheeler",
    fuelType: "Petrol",
    weeklyQuota: 10,
    monthlyQuota: 40,
    lastUpdated: "May 15, 2025"
  }
]

export default function QuotaManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fuel Quota Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart className="h-4 w-4" /> View Quota Analytics
          </Button>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-600 gap-2">
            <PenSquare className="h-4 w-4" /> Edit Quota Policies
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Fuel Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">352,450 L</div>
            <p className="text-xs text-muted-foreground">
              For May 2025
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Allocation Used</span>
                <span className="font-medium">45%</span>
              </div>
              <Progress value={45} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Petrol Quotas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">225,800 L</div>
            <p className="text-xs text-muted-foreground">
              5 vehicle categories
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Usage</span>
                <span className="font-medium">52%</span>
              </div>
              <Progress value={52} className="bg-amber-100" indicatorClassName="bg-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Diesel Quotas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">126,650 L</div>
            <p className="text-xs text-muted-foreground">
              3 vehicle categories
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Usage</span>
                <span className="font-medium">38%</span>
              </div>
              <Progress value={38} className="bg-blue-100" indicatorClassName="bg-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Special Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Active special allocations
            </p>
            <div className="mt-3">
              <Button variant="link" className="p-0 text-xs h-auto text-amber-600">
                Manage special allocations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quota Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Types</TabsTrigger>
                <TabsTrigger value="petrol">Petrol</TabsTrigger>
                <TabsTrigger value="diesel">Diesel</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search categories..."
                    className="w-[200px] pl-8"
                  />
                </div>
                <Select defaultValue="weekly">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly Quota</SelectItem>
                    <SelectItem value="monthly">Monthly Quota</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              <QuotaCategoriesTable categories={quotaCategories} />
            </TabsContent>
            
            <TabsContent value="petrol" className="m-0">
              <QuotaCategoriesTable 
                categories={quotaCategories.filter(category => category.fuelType === "Petrol")} 
              />
            </TabsContent>
            
            <TabsContent value="diesel" className="m-0">
              <QuotaCategoriesTable 
                categories={quotaCategories.filter(category => category.fuelType === "Diesel")} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quota Adjustment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700">
                <PenSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Weekly quota for SUVs increased from 20L to 25L</p>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HistoryIcon className="h-3 w-3" /> May 15, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> By Admin
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 pb-3 border-b">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700">
                <PenSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Monthly quota for Three-wheelers reduced from 45L to 40L</p>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HistoryIcon className="h-3 w-3" /> May 10, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> By Admin
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700">
                <PenSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">New quota category added for Electric Hybrids</p>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HistoryIcon className="h-3 w-3" /> May 5, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> By Admin
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="link" className="mt-4 p-0 h-auto">
            View complete history
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function QuotaCategoriesTable({ categories }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead>Weekly Quota (L)</TableHead>
            <TableHead>Monthly Quota (L)</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.id}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Car className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  {category.vehicleType}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {category.fuelType === "Petrol" ? (
                    <Droplet className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                  ) : (
                    <Fuel className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
                  )}
                  {category.fuelType}
                </div>
              </TableCell>
              <TableCell>{category.weeklyQuota} L</TableCell>
              <TableCell>{category.monthlyQuota} L</TableCell>
              <TableCell>{category.lastUpdated}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Quota</DropdownMenuItem>
                    <DropdownMenuItem>View History</DropdownMenuItem>
                    <DropdownMenuItem>Manage Special Cases</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
