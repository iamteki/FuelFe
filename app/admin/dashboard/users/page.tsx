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
  CheckCircle,
  ChevronDown, 
  Download,
  Lock, 
  Search, 
  ShieldAlert, 
  SlidersHorizontal, 
  User as UserIcon, 
  UserPlus 
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const users = [
  {
    id: "U1001",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    lastLogin: "May 22, 2025 (10:30 AM)",
    status: "active"
  },
  {
    id: "U1002",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "vehicle_owner",
    lastLogin: "May 21, 2025 (09:15 AM)",
    status: "active"
  },
  {
    id: "U1003",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "station_owner",
    lastLogin: "May 20, 2025 (02:45 PM)",
    status: "active"
  },
  {
    id: "U1004",
    name: "Michael Fernando",
    email: "michael.f@example.com",
    role: "vehicle_owner",
    lastLogin: "May 19, 2025 (11:20 AM)",
    status: "active"
  },
  {
    id: "U1005",
    name: "David Wilson",
    email: "david.w@example.com",
    role: "vehicle_owner",
    lastLogin: "May 18, 2025 (04:10 PM)",
    status: "locked"
  },
  {
    id: "U1006",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    role: "station_owner",
    lastLogin: "May 15, 2025 (01:30 PM)",
    status: "locked"
  },
  {
    id: "U1007",
    name: "Anura Perera",
    email: "anura.p@example.com",
    role: "vehicle_owner",
    lastLogin: "May 10, 2025 (09:45 AM)",
    status: "suspended"
  }
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
          <UserPlus className="mr-2 h-4 w-4" /> Create New User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Users</div>
            <div className="text-2xl font-bold">342</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Vehicle Owners</div>
            <div className="text-2xl font-bold">254</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Station Owners</div>
            <div className="text-2xl font-bold">86</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Admins</div>
            <div className="text-2xl font-bold">2</div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="vehicle_owner">Vehicle Owners</TabsTrigger>
            <TabsTrigger value="station_owner">Station Owners</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
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
          <UsersTable users={users} />
        </TabsContent>
        
        <TabsContent value="vehicle_owner" className="m-0">
          <UsersTable users={users.filter(user => user.role === "vehicle_owner")} />
        </TabsContent>
        
        <TabsContent value="station_owner" className="m-0">
          <UsersTable users={users.filter(user => user.role === "station_owner")} />
        </TabsContent>
        
        <TabsContent value="admin" className="m-0">
          <UsersTable users={users.filter(user => user.role === "admin")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UsersTable({ users }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
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
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuItem>Reset Password</DropdownMenuItem>
                    {user.status === "active" ? (
                      <DropdownMenuItem className="text-red-600">Lock Account</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-green-600">Activate Account</DropdownMenuItem>
                    )}
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

function RoleBadge({ role }) {
  if (role === "admin") {
    return (
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
        <ShieldAlert className="mr-1 h-3 w-3" /> Admin
      </Badge>
    )
  }
  
  if (role === "vehicle_owner") {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        Vehicle Owner
      </Badge>
    )
  }
  
  if (role === "station_owner") {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        Station Owner
      </Badge>
    )
  }
  
  return null
}

function StatusBadge({ status }) {
  if (status === "active") {
    return (
      <div className="flex items-center">
        <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
        <span className="text-sm">Active</span>
      </div>
    )
  }
  
  if (status === "locked") {
    return (
      <div className="flex items-center">
        <Lock className="mr-1 h-4 w-4 text-amber-600" />
        <span className="text-sm">Locked</span>
      </div>
    )
  }
  
  if (status === "suspended") {
    return (
      <div className="flex items-center">
        <UserIcon className="mr-1 h-4 w-4 text-red-600" />
        <span className="text-sm">Suspended</span>
      </div>
    )
  }
  
  return null
}
