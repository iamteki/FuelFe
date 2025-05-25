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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Car, 
  Check, 
  ChevronDown, 
  Download, 
  Search, 
  SlidersHorizontal, 
  X 
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const vehicleOwners = [
  {
    id: "VO1001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+94 71 1234567",
    vehicles: 2,
    status: "approved"
  },
  {
    id: "VO1002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+94 77 2345678",
    vehicles: 1,
    status: "approved"
  },
  {
    id: "VO1003",
    name: "Michael Fernando",
    email: "michael.f@example.com",
    phone: "+94 76 3456789",
    vehicles: 3,
    status: "approved"
  },
  {
    id: "VO1004",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    phone: "+94 75 4567890",
    vehicles: 2,
    status: "pending"
  },
  {
    id: "VO1005",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+94 70 5678901",
    vehicles: 1,
    status: "pending"
  },
  {
    id: "VO1006",
    name: "Anura Perera",
    email: "anura.p@example.com",
    phone: "+94 71 6789012",
    vehicles: 2,
    status: "rejected"
  }
]

export default function VehicleOwnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vehicle Owners Management</h1>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
          <Car className="mr-2 h-4 w-4" /> Register New Vehicle Owner
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Owner Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Owners</div>
            <div className="text-2xl font-bold">254</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Active Owners</div>
            <div className="text-2xl font-bold">218</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Pending Approvals</div>
            <div className="text-2xl font-bold">12</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Registered Vehicles</div>
            <div className="text-2xl font-bold">387</div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Owners</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search owners..."
                className="w-[250px] pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="m-0">
          <OwnersTable owners={vehicleOwners} />
        </TabsContent>
        
        <TabsContent value="approved" className="m-0">
          <OwnersTable owners={vehicleOwners.filter(owner => owner.status === "approved")} />
        </TabsContent>
        
        <TabsContent value="pending" className="m-0">
          <OwnersTable owners={vehicleOwners.filter(owner => owner.status === "pending")} />
        </TabsContent>
        
        <TabsContent value="rejected" className="m-0">
          <OwnersTable owners={vehicleOwners.filter(owner => owner.status === "rejected")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OwnersTable({ owners }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Vehicles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {owners.map((owner) => (
            <TableRow key={owner.id}>
              <TableCell className="font-medium">{owner.id}</TableCell>
              <TableCell>{owner.name}</TableCell>
              <TableCell>{owner.email}</TableCell>
              <TableCell>{owner.phone}</TableCell>
              <TableCell>{owner.vehicles}</TableCell>
              <TableCell>
                <StatusBadge status={owner.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Manage Vehicles</DropdownMenuItem>
                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
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

function StatusBadge({ status }) {
  if (status === "approved") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <Check className="mr-1 h-3 w-3" /> Approved
      </Badge>
    )
  }
  
  if (status === "pending") {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        Pending
      </Badge>
    )
  }
  
  if (status === "rejected") {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <X className="mr-1 h-3 w-3" /> Rejected
      </Badge>
    )
  }
  
  return null
}
