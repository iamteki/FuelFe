"use client"

import { Button } from "@/components/ui/button"
import { FileDown, Filter } from "lucide-react"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FilterControls() {  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [vehicle, setVehicle] = useState<string>("all")
  const [fuelType, setFuelType] = useState<string>("all")

  return (
    <div className="flex flex-wrap gap-3 mb-4 mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {startDate ? format(startDate, "PPP") : "Start Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={setStartDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {endDate ? format(endDate, "PPP") : "End Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>      <Select value={vehicle} onValueChange={setVehicle}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All vehicles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All vehicles</SelectItem>
          <SelectItem value="Toyota Corolla (ABC-1234)">Toyota Corolla (ABC-1234)</SelectItem>
          <SelectItem value="Honda Civic (XYZ-5678)">Honda Civic (XYZ-5678)</SelectItem>
        </SelectContent>
      </Select>

      <Select value={fuelType} onValueChange={setFuelType}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All fuel types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All fuel types</SelectItem>
          <SelectItem value="Petrol 92">Petrol 92</SelectItem>
          <SelectItem value="Petrol 95">Petrol 95</SelectItem>
          <SelectItem value="Diesel">Diesel</SelectItem>
        </SelectContent>
      </Select>      <Button variant="secondary">Apply Filters</Button>
      <Button 
        variant="outline" 
        onClick={() => {
          setStartDate(undefined);
          setEndDate(undefined);
          setVehicle("all");
          setFuelType("all");
        }}
      >
        Reset
      </Button>
    </div>
  )
}

export function ExportButton() {
  return (
    <Button variant="outline" className="flex items-center gap-2">
      <FileDown className="h-4 w-4" />
      Export Data
    </Button>
  )
}
