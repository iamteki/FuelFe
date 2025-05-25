"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Droplet, Edit, RefreshCw } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const inventoryUpdateSchema = z.object({
  station: z.string({
    required_error: "Please select a station.",
  }),
  fuelType: z.string({
    required_error: "Please select a fuel type.",
  }),
  currentCapacity: z.number().min(0, "Capacity must be 0 or higher"),
  totalCapacity: z.number().min(100, "Total capacity must be at least 100 liters"),
  unitPrice: z.number().min(0, "Unit price must be 0 or higher"),
})

type InventoryUpdateValues = z.infer<typeof inventoryUpdateSchema>

// Mock data for fuel inventory
const initialInventory = [
  {
    id: "1",
    stationId: "1",
    stationName: "Central Fuel Station",
    fuelType: "Petrol 92",
    currentCapacity: 1500, // Low stock to trigger the alert
    totalCapacity: 10000,
    unitPrice: 320,
    lastUpdated: "2025-05-21T14:30:00",
  },
  {
    id: "2",
    stationId: "1",
    stationName: "Central Fuel Station",
    fuelType: "Petrol 95",
    currentCapacity: 3000,
    totalCapacity: 5000,
    unitPrice: 350,
    lastUpdated: "2025-05-21T14:30:00",
  },
  {
    id: "3",
    stationId: "1",
    stationName: "Central Fuel Station",
    fuelType: "Diesel",
    currentCapacity: 7000,
    totalCapacity: 15000,
    unitPrice: 280,
    lastUpdated: "2025-05-21T14:30:00",
  },
]

// Mock data for stations
const stations = [
  {
    id: "1",
    name: "Central Fuel Station",
  }
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<(typeof inventory)[0] | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lowStockItems, setLowStockItems] = useState<typeof initialInventory>([])
  
  const form = useForm<InventoryUpdateValues>({
    resolver: zodResolver(inventoryUpdateSchema),
    defaultValues: {
      station: "",
      fuelType: "",
      currentCapacity: 0,
      totalCapacity: 0,
      unitPrice: 0,
    },
  })
  
  // Check for low stock levels and display notifications
  useEffect(() => {
    const lowItems = inventory.filter(item => 
      (item.currentCapacity / item.totalCapacity) < 0.2
    );
    setLowStockItems(lowItems);
    
    // Show toast notifications for critically low items (less than 10%)
    const criticalItems = inventory.filter(item => 
      (item.currentCapacity / item.totalCapacity) < 0.1
    );
    
    if (criticalItems.length > 0) {
      criticalItems.forEach(item => {
        toast({
          title: "Critical Fuel Level",
          description: `${item.fuelType} at ${item.stationName} is critically low (${Math.round((item.currentCapacity / item.totalCapacity) * 100)}%)`,
          variant: "destructive",
        });
      });
    }
  }, [inventory]);

  function onSubmit(data: InventoryUpdateValues) {
    setIsUpdating(true)

    // Simulate API call delay
    setTimeout(() => {
      if (editingItem) {
        // Update existing inventory
        setInventory(inventory.map(item => 
          item.id === editingItem.id 
            ? {
                ...item,
                currentCapacity: data.currentCapacity,
                totalCapacity: data.totalCapacity,
                unitPrice: data.unitPrice,
                lastUpdated: new Date().toISOString(),
              } 
            : item
        ))
        toast({
          title: "Inventory updated",
          description: `${data.fuelType} inventory has been updated for ${stations.find(s => s.id === data.station)?.name}.`,
        })
      } else {
        // Add new inventory
        const stationName = stations.find(s => s.id === data.station)?.name || "";
        setInventory([
          ...inventory, 
          {
            id: Date.now().toString(),
            stationId: data.station,
            stationName,
            fuelType: data.fuelType,
            currentCapacity: data.currentCapacity,
            totalCapacity: data.totalCapacity,
            unitPrice: data.unitPrice,
            lastUpdated: new Date().toISOString(),
          }
        ])
        toast({
          title: "Inventory added",
          description: `${data.fuelType} inventory has been added for ${stationName}.`,
        })
      }

      setIsDialogOpen(false)
      setEditingItem(null)
      setIsUpdating(false)
      form.reset()
    }, 1500)
  }

  function handleEditInventory(item: (typeof inventory)[0]) {
    setEditingItem(item)
    form.reset({
      station: item.stationId,
      fuelType: item.fuelType,
      currentCapacity: item.currentCapacity,
      totalCapacity: item.totalCapacity,
      unitPrice: item.unitPrice,
    })
    setIsDialogOpen(true)
  }

  // Format the date string
  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate percentage for progress bar
  function calculatePercentage(current: number, total: number) {
    return Math.round((current / total) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fuel Inventory</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Update Inventory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Update Fuel Inventory" : "Add Fuel Inventory"}</DialogTitle>
              <DialogDescription>
                {editingItem 
                  ? "Update your current fuel inventory levels and prices."
                  : "Add new fuel type to your station's inventory."
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="station"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Station</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value} 
                        disabled={!!editingItem}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a station" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stations.map((station) => (
                            <SelectItem key={station.id} value={station.id}>{station.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!!editingItem}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Petrol 92">Petrol 92</SelectItem>
                          <SelectItem value="Petrol 95">Petrol 95</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Super Diesel">Super Diesel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Capacity (L)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={e => field.onChange(e.target.valueAsNumber || 0)} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Capacity (L)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={e => field.onChange(e.target.valueAsNumber || 0)} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price (Rs.)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(e.target.valueAsNumber || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormDescription>
                  Providing accurate fuel inventory information is essential for proper quota management.
                </FormDescription>

                <DialogFooter>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      editingItem ? "Update Inventory" : "Add Inventory"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {lowStockItems.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Fuel Stock Alert</AlertTitle>
          <AlertDescription>
            {lowStockItems.length === 1 ? (
              <p>
                <strong>{lowStockItems[0].fuelType}</strong> at {lowStockItems[0].stationName} is running low 
                ({Math.round((lowStockItems[0].currentCapacity / lowStockItems[0].totalCapacity) * 100)}% remaining).
                Please consider restocking soon.
              </p>
            ) : (
              <div>
                <p className="mb-2">{lowStockItems.length} fuel types are running low. Please consider restocking:</p>
                <ul className="list-disc list-inside space-y-1">
                  {lowStockItems.map(item => (
                    <li key={item.id}>
                      <strong>{item.fuelType}</strong> at {item.stationName}
                      ({Math.round((item.currentCapacity / item.totalCapacity) * 100)}% remaining)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Fuel Types</TabsTrigger>
          <TabsTrigger value="petrol">Petrol</TabsTrigger>
          <TabsTrigger value="diesel">Diesel</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {inventory.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">{item.fuelType}</CardTitle>
                  <Droplet className={`h-5 w-5 ${
                    item.fuelType.includes('Petrol') ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Current Capacity</span>
                      <span className="font-medium">{item.currentCapacity.toLocaleString()} L</span>
                    </div>
                    <Progress value={calculatePercentage(item.currentCapacity, item.totalCapacity)} 
                      className="h-2"
                      indicatorClassName={`${
                        calculatePercentage(item.currentCapacity, item.totalCapacity) < 20
                          ? "bg-red-500"
                          : calculatePercentage(item.currentCapacity, item.totalCapacity) < 50
                          ? "bg-amber-500"
                          : "bg-teal-500"
                      }`}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>0 L</span>
                      <span>Total: {item.totalCapacity.toLocaleString()} L</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Unit Price:</div>
                    <div className="font-medium">Rs. {item.unitPrice.toFixed(2)}</div>

                    <div className="text-muted-foreground">Station:</div>
                    <div>{item.stationName}</div>

                    <div className="text-muted-foreground">Last Updated:</div>
                    <div>{formatDate(item.lastUpdated)}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleEditInventory(item)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Update Inventory
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="petrol" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {inventory
              .filter(item => item.fuelType.includes('Petrol'))
              .map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{item.fuelType}</CardTitle>
                    <Droplet className="h-5 w-5 text-amber-500" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Current Capacity</span>
                        <span className="font-medium">{item.currentCapacity.toLocaleString()} L</span>
                      </div>
                      <Progress value={calculatePercentage(item.currentCapacity, item.totalCapacity)} 
                        className="h-2"
                        indicatorClassName={`${
                          calculatePercentage(item.currentCapacity, item.totalCapacity) < 20
                            ? "bg-red-500"
                            : calculatePercentage(item.currentCapacity, item.totalCapacity) < 50
                            ? "bg-amber-500"
                            : "bg-teal-500"
                        }`}
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>0 L</span>
                        <span>Total: {item.totalCapacity.toLocaleString()} L</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Unit Price:</div>
                      <div className="font-medium">Rs. {item.unitPrice.toFixed(2)}</div>

                      <div className="text-muted-foreground">Station:</div>
                      <div>{item.stationName}</div>

                      <div className="text-muted-foreground">Last Updated:</div>
                      <div>{formatDate(item.lastUpdated)}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleEditInventory(item)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Update Inventory
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="diesel" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {inventory
              .filter(item => item.fuelType.includes('Diesel'))
              .map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{item.fuelType}</CardTitle>
                    <Droplet className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Current Capacity</span>
                        <span className="font-medium">{item.currentCapacity.toLocaleString()} L</span>
                      </div>
                      <Progress value={calculatePercentage(item.currentCapacity, item.totalCapacity)} 
                        className="h-2"
                        indicatorClassName={`${
                          calculatePercentage(item.currentCapacity, item.totalCapacity) < 20
                            ? "bg-red-500"
                            : calculatePercentage(item.currentCapacity, item.totalCapacity) < 50
                            ? "bg-amber-500"
                            : "bg-teal-500"
                        }`}
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>0 L</span>
                        <span>Total: {item.totalCapacity.toLocaleString()} L</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Unit Price:</div>
                      <div className="font-medium">Rs. {item.unitPrice.toFixed(2)}</div>

                      <div className="text-muted-foreground">Station:</div>
                      <div>{item.stationName}</div>

                      <div className="text-muted-foreground">Last Updated:</div>
                      <div>{formatDate(item.lastUpdated)}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleEditInventory(item)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Update Inventory
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {inventory.length === 0 && (
        <div className="text-center p-10 border rounded-lg bg-slate-50">
          <Droplet className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">No fuel inventory found</h3>
          <p className="text-muted-foreground mb-4">You haven't added any fuel inventory yet.</p>
          <Button onClick={() => setIsDialogOpen(true)}>Add Your First Inventory</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory Management Guidelines</CardTitle>
          <CardDescription>Best practices for managing your fuel inventory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Regular Updates</h3>
            <p className="text-sm">
              Keep your inventory updated daily to ensure accurate quota distribution to your customers.
              Updates should reflect both new deliveries and daily sales.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Low Stock Alerts</h3>
            <p className="text-sm">
              The system will automatically alert you when your fuel inventory falls below 20% capacity.
              This helps you plan for timely reordering.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Price Updates</h3>
            <p className="text-sm">
              Ensure that your fuel prices are current and reflect any government or supplier price changes.
              All price updates are automatically reflected in customer transactions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
