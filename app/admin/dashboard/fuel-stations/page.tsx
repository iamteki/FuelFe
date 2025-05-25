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
  Check, 
  ChevronDown, 
  Download, 
  Droplet, 
  MapPin,
  Search, 
  SlidersHorizontal, 
  Store, 
  X 
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const fuelStations = [
  {
    id: "FS1001",
    name: "Central Fuel Station",
    location: "Colombo 07",
    owner: "Sarah Johnson",
    fuelTypes: ["Petrol 92", "Petrol 95", "Diesel"],
    status: "active"
  },
  {
    id: "FS1002",
    name: "Highway Fuels",
    location: "Gampaha",
    owner: "David Perera",
    fuelTypes: ["Petrol 92", "Diesel"],
    status: "active"
  },
  {
    id: "FS1003",
    name: "City Energy Center",
    location: "Kandy",
    owner: "Michael Silva",
    fuelTypes: ["Petrol 92", "Petrol 95", "Diesel", "Super Diesel"],
    status: "active"
  },
  {
    id: "FS1004",
    name: "Green Petroleum",
    location: "Negombo",
    owner: "Amara Gunawardena",
    fuelTypes: ["Petrol 92", "Petrol 95", "Diesel"],
    status: "pending"
  },
  {
    id: "FS1005",
    name: "Express Fuels",
    location: "Galle",
    owner: "John Fernando",
    fuelTypes: ["Petrol 92", "Diesel"],
    status: "pending"
  },
  {
    id: "FS1006",
    name: "Marine Fuels",
    location: "Trincomalee",
    owner: "Sunil Bandara",
    fuelTypes: ["Petrol 92", "Diesel"],
    status: "inactive"
  }
]

export default function FuelStationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fuel Stations Management</h1>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
          <Store className="mr-2 h-4 w-4" /> Register New Fuel Station
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Fuel Station Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Stations</div>
            <div className="text-2xl font-bold">86</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Active Stations</div>
            <div className="text-2xl font-bold">72</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Pending Approvals</div>
            <div className="text-2xl font-bold">8</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Inactive Stations</div>
            <div className="text-2xl font-bold">6</div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Stations</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search stations..."
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
          <StationsTable stations={fuelStations} />
        </TabsContent>
        
        <TabsContent value="active" className="m-0">
          <StationsTable stations={fuelStations.filter(station => station.status === "active")} />
        </TabsContent>
        
        <TabsContent value="pending" className="m-0">
          <StationsTable stations={fuelStations.filter(station => station.status === "pending")} />
        </TabsContent>
        
        <TabsContent value="inactive" className="m-0">
          <StationsTable stations={fuelStations.filter(station => station.status === "inactive")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StationsTable({ stations }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Station Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Fuel Types</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station.id}>
              <TableCell className="font-medium">{station.id}</TableCell>
              <TableCell>{station.name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                  {station.location}
                </div>
              </TableCell>
              <TableCell>{station.owner}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {station.fuelTypes.map((type) => (
                    <Badge key={type} variant="outline" className="bg-slate-100">
                      <Droplet className="mr-1 h-3 w-3 text-blue-500" />
                      {type}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={station.status} />
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
                    <DropdownMenuItem>Manage Inventory</DropdownMenuItem>
                    <DropdownMenuItem>Edit Station</DropdownMenuItem>
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
  if (status === "active") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <Check className="mr-1 h-3 w-3" /> Active
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
  
  if (status === "inactive") {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <X className="mr-1 h-3 w-3" /> Inactive
      </Badge>
    )
  }
  
  return null
}
