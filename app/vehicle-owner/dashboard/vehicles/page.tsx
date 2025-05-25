"use client"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Car, Edit, Plus, Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast"

const vehicleFormSchema = z.object({
  vehicleType: z.string({
    required_error: "Please select a vehicle type.",
  }),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year must be 4 digits").max(4, "Year must be 4 digits"),
  licensePlate: z.string().min(1, "License plate is required"),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  engineNumber: z.string().min(1, "Engine number is required"),
})

type VehicleFormValues = z.infer<typeof vehicleFormSchema>

export default function VehiclesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehicleType: "",
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      chassisNumber: "",
      engineNumber: "",
    },
  })

  function onSubmit(data: VehicleFormValues) {
    toast({
      title: "Vehicle successfully registered",
      description: "Your vehicle has been verified and added to your account.",
    })
    setIsDialogOpen(false)
    form.reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Vehicles</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register New Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Register New Vehicle</DialogTitle>
              <DialogDescription>
                Enter your vehicle details for registration. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="bus">Bus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Toyota" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Corolla" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2020" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Plate</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. ABC-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="chassisNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chassis Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. JT2BF22K1W0123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engineNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 1ZZ-0123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormDescription>
                  Your vehicle details will be instantly verified with the Department of Motor Traffic database.
                </FormDescription>

                <DialogFooter>
                  <Button type="submit">Register Vehicle</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Vehicles</TabsTrigger>
          <TabsTrigger value="pending">Register New Vehicle</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Toyota Corolla</CardTitle>
                <Car className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">License Plate:</div>
                  <div className="font-medium">ABC-1234</div>

                  <div className="text-muted-foreground">Vehicle Type:</div>
                  <div>Car</div>

                  <div className="text-muted-foreground">Year:</div>
                  <div>2020</div>

                  <div className="text-muted-foreground">Status:</div>
                  <div className="text-green-600 font-medium">Active</div>

                  <div className="text-muted-foreground">Fuel Quota:</div>
                  <div>20 L Petrol / Month</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <div className="flex flex-col items-center justify-center p-6 gap-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Register a New Vehicle</h3>
              <p className="text-muted-foreground">Add your vehicle to access fuel quota allocations</p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
              Register Vehicle
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Registration Guidelines</CardTitle>
          <CardDescription>Important information about registering your vehicles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Required Details</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Chassis Number</li>
              <li>Engine Number</li>
              <li>Vehicle Identification Number (VIN)</li>
              <li>Registration Number</li>
              <li>Vehicle Make and Model</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Verification Process</h3>
            <p className="text-sm">
              All vehicle registrations are instantly verified through our automated system. Your vehicle will be activated immediately after successful verification with the Department of Motor Traffic database.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Quota Allocation</h3>
            <p className="text-sm">
              Fuel quota is allocated based on the vehicle type and usage category. Standard allocations are as follows:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>Cars: 20 L Petrol / Month</li>
              <li>Motorcycles: 10 L Petrol / Month</li>
              <li>Vans: 30 L Petrol or Diesel / Month</li>
              <li>Trucks: 50 L Diesel / Month</li>
              <li>Buses: 60 L Diesel / Month</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
