"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { TransactionTabs, QRScanDialog } from "./client-components"

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Transactions</h1>
        <QRScanDialog />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Transactions</Label>
          <div className="flex w-full items-center space-x-2 mt-1.5">
            <Input id="search" placeholder="Search by vehicle number, date, etc." className="bg-white" />
            <Button type="submit" size="icon" className="bg-gradient-to-r from-teal-500 to-emerald-600">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <Button variant="outline">Today</Button>
          <Button variant="outline">This Week</Button>
          <Button variant="outline">This Month</Button>
        </div>
      </div>

      <TransactionTabs />
    </div>
  )
}
