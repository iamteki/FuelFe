"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function VehicleOwnerActivityTabs() {
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
            <p className="font-medium">Central Fuel Station</p>
            <p className="text-sm text-slate-500">May 18, 2025</p>
          </div>
          <div className="text-right">
            <p className="font-medium">4.5 L</p>
            <p className="text-sm text-slate-500">Petrol</p>
          </div>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-medium">Highway Fuel Station</p>
            <p className="text-sm text-slate-500">May 10, 2025</p>
          </div>
          <div className="text-right">
            <p className="font-medium">5.0 L</p>
            <p className="text-sm text-slate-500">Petrol</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">City Fuel Station</p>
            <p className="text-sm text-slate-500">May 2, 2025</p>
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
            <p className="font-medium">Central Fuel Station</p>
            <p className="text-sm text-slate-500">May 18, 2025</p>
          </div>
          <div className="text-right">
            <p className="font-medium">4.5 L</p>
            <p className="text-sm text-slate-500">Petrol</p>
          </div>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-medium">Highway Fuel Station</p>
            <p className="text-sm text-slate-500">May 10, 2025</p>
          </div>
          <div className="text-right">
            <p className="font-medium">5.0 L</p>
            <p className="text-sm text-slate-500">Petrol</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">City Fuel Station</p>
            <p className="text-sm text-slate-500">May 2, 2025</p>
          </div>
          <div className="text-right">
            <p className="font-medium">5.5 L</p>
            <p className="text-sm text-slate-500">Petrol</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="diesel" className="mt-4">
        <div className="flex items-center justify-center h-24 text-slate-500">No diesel transactions found</div>
      </TabsContent>
    </Tabs>
  )
}
