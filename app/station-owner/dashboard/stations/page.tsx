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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, MapPin, Plus, Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const stationFormSchema = z.object({
  name: z.string().min(3, "Station name must be at least 3 characters."),
  address: z.string().min(5, "Address is required and must be at least 5 characters."),
  city: z.string().min(2, "City is required."),
  postalCode: z.string().min(5, "Postal code is required."),
  phone: z.string().min(10, "Phone number is required."),
  registrationNumber: z.string().min(3, "Registration number is required."),
})

type StationFormValues = z.infer<typeof stationFormSchema>

// Mock data for existing stations
const initialStations = [
  {
    id: "1",
    name: "Central Fuel Station",
    address: "123 Main Street",
    city: "Colombo",
    postalCode: "10100",
    phone: "011-222-3333",
    registrationNumber: "FS-12345",
  }
]

export default function StationsPage() {
  const [stations, setStations] = useState(initialStations)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStation, setEditingStation] = useState<(typeof stations)[0] | null>(null)

  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      registrationNumber: "",
    },
  })

  function onSubmit(data: StationFormValues) {
    if (editingStation) {
      // Update existing station
      setStations(stations.map(station => 
        station.id === editingStation.id ? { ...station, ...data } : station
      ))
      toast({
        title: "Station updated",
        description: "Your fuel station details have been updated.",
      })
    } else {
      // Add new station
      setStations([...stations, { id: Date.now().toString(), ...data }])
      toast({
        title: "Station registered",
        description: "Your new fuel station has been registered successfully.",
      })
    }
    setIsDialogOpen(false)
    setEditingStation(null)
    form.reset()
  }

  function handleEditStation(station: (typeof stations)[0]) {
    setEditingStation(station)
    form.reset({
      name: station.name,
      address: station.address,
      city: station.city,
      postalCode: station.postalCode,
      phone: station.phone,
      registrationNumber: station.registrationNumber,
    })
    setIsDialogOpen(true)
  }

  function handleDeleteStation(stationId: string) {
    setStations(stations.filter(station => station.id !== stationId))
    toast({
      title: "Station deleted",
      description: "The fuel station has been removed from your account.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Stations</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register New Station
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingStation ? "Edit Station" : "Register New Station"}</DialogTitle>
              <DialogDescription>
                {editingStation 
                  ? "Update your fuel station details below."
                  : "Enter your fuel station details for registration. All fields are required."
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Station Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Central Fuel Station" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. FS-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-1 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Colombo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 10100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 011-222-3333" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormDescription>
                  Your station details will be used for fuel quota management and reporting.
                </FormDescription>

                <DialogFooter>
                  <Button type="submit">{editingStation ? "Update Station" : "Register Station"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {stations.map((station) => (
          <Card key={station.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{station.name}</CardTitle>
              <MapPin className="h-5 w-5 text-teal-500" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Registration Number:</div>
                <div className="font-medium">{station.registrationNumber}</div>

                <div className="text-muted-foreground">Address:</div>
                <div>{station.address}</div>

                <div className="text-muted-foreground">City:</div>
                <div>{station.city}, {station.postalCode}</div>

                <div className="text-muted-foreground">Phone:</div>
                <div>{station.phone}</div>

                <div className="text-muted-foreground">Status:</div>
                <div className="text-green-600 font-medium">Active</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleEditStation(station)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the fuel station from your account. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteStation(station.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      {stations.length === 0 && (
        <div className="text-center p-10 border rounded-lg bg-slate-50">
          <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">No stations registered</h3>
          <p className="text-muted-foreground mb-4">You haven't registered any fuel stations yet.</p>
          <Button onClick={() => setIsDialogOpen(true)}>Register Your First Station</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Registration Guidelines</CardTitle>
          <CardDescription>Important information about registering your fuel stations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Required Details</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Valid fuel station registration number</li>
              <li>Complete address details</li>
              <li>Contact information</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Management Features</h3>
            <p className="text-sm">
              Once your fuel station is registered, you can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li>Manage fuel inventory</li>
              <li>Process customer transactions</li>
              <li>Update station details</li>
              <li>View transaction history</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
